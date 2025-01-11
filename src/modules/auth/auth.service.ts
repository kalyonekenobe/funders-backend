import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { AuthException } from 'src/core/exceptions/auth.exception';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { CreateUserDto } from 'src/modules/user/DTO/create-user.dto';
import {
  GenerateDiscordOAuth2Response,
  GenerateGoogleOAuth2Response,
  JwtTokensPairResponse,
  LoginResponse,
  OAuth2Payload,
  RefreshResponse,
  RegisterResponse,
} from 'src/modules/auth/types/auth.types';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { LogoutDto } from 'src/modules/auth/DTO/logout.dto';
import { RefreshDto } from 'src/modules/auth/DTO/refresh.dto';
import { HttpService } from '@nestjs/axios';
import { LoginWithCredentialsDto } from 'src/modules/auth/DTO/login-with-credentials.dto';
import { LoginWithGoogleDto } from 'src/modules/auth/DTO/login-with-google.dto';
import { LoginWithDiscordDto } from 'src/modules/auth/DTO/login-with-discord.dto';
import { PasswordService } from 'src/modules/infrastructure/password/password.service';
import { UserRegistrationMethods } from '@prisma/client';
import { UserRoleService } from 'src/modules/user/submodules/user-role/user-role.service';
import { ServerException } from 'src/core/exceptions/server.exception';
import bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { LoginWithSolanaWalletDto } from 'src/modules/auth/DTO/login-with-solana-wallet.dto';

@Injectable()
export class AuthService {
  private readonly googleOAuth2Client: Auth.OAuth2Client;

  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.googleOAuth2Client = new google.auth.OAuth2(
      configService.get<string>(ConfigVariables.GoogleClientId),
      configService.get<string>(ConfigVariables.GoogleClientSecret),
      `${configService.get<string>(ConfigVariables.ServerUri)}/oauth2/callback/google`,
    );
  }

  public async validateUser(
    email: UserEntity['email'],
    password: UserEntity['password'],
  ): Promise<UserPublicEntity> {
    try {
      const user = await this.userService.findOnePrivate({ where: { email } });

      if (user.userRegistrationMethod === UserRegistrationMethods.Credentials) {
        if (!password) {
          throw new AuthException(
            'The provided credentials are invalid. Please verify your email and password and try again.',
          );
        }

        if (!user.password) {
          throw new AuthException('Cannot validate the user. Please try again later.');
        }

        const isPasswordCorrect = await this.passwordService.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new AuthException(
            'The provided credentials are invalid. Please verify your email and password and try again.',
          );
        }
      }

      const { password: _, ...result } = user;

      return result;
    } catch (error: unknown) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException(
        'The provided credentials are invalid. Please verify your email and password and try again.',
      );
    }
  }

  public async register(data: CreateUserDto): Promise<RegisterResponse> {
    const user = await this.userService.create(data);
    const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

    await this.userService.update(user.id, { refreshToken });

    return { ...user, accessToken, refreshToken };
  }

  public async loginWithCredentials(
    loginWithCredentialsDto: LoginWithCredentialsDto,
  ): Promise<LoginResponse> {
    const { email, password } = loginWithCredentialsDto;
    const user = await this.userService.findOnePrivate({ where: { email } });

    if (user.userRegistrationMethod !== UserRegistrationMethods.Credentials) {
      if (!user.password || !password) {
        throw new AuthException(
          'The provided credentials are invalid. Please verify your email and password and try again.',
        );
      }

      const passwordsAreEqual = await this.passwordService.compare(password, user.password);

      if (!passwordsAreEqual) {
        throw new AuthException(
          'The provided credentials are invalid. Please verify your email and password and try again.',
        );
      }
    }

    await this.validateUser(email, password);

    const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

    await this.userService.update(user.id, { refreshToken });

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...userWithoutPasswordAndRefreshToken
    } = user;

    return { ...userWithoutPasswordAndRefreshToken, accessToken, refreshToken };
  }

  public async loginWithGoogle(loginWithGoogleDto: LoginWithGoogleDto): Promise<LoginResponse> {
    try {
      const { googleAccessToken } = loginWithGoogleDto;
      const tokenInfo = await this.googleOAuth2Client.getTokenInfo(googleAccessToken);
      const { email } = tokenInfo;

      const user = await this.userService.findFirstOrDefault({ where: { email } });

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userService.update(user.id, { refreshToken });

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('Cannot authorize the user with provided credentials.');
    }
  }

  public async loginWithDiscord(loginWithDiscordDto: LoginWithDiscordDto): Promise<LoginResponse> {
    try {
      const response = await this.httpService.axiosRef.get(`https://discordapp.com/api/users/@me`, {
        headers: {
          Authorization: `Bearer ${loginWithDiscordDto.discordAccessToken}`,
        },
      });

      if (response.status !== HttpStatus.OK) {
        throw new AuthException('Cannot fetch the Discord user info with provided access token');
      }

      const { email } = response.data;
      const user = await this.userService.findOne({ where: { email } });

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userService.update(user.id, { refreshToken });

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('Cannot authorize the user with provided credentials.');
    }
  }

  public async loginWithSolanaWallet(
    loginWithSolanaWalletDto: LoginWithSolanaWalletDto,
  ): Promise<LoginResponse> {
    try {
      const { solanaWalletAccessToken } = loginWithSolanaWalletDto;
      const [publicKey, payload, signature] = solanaWalletAccessToken.split('.');
      const { authMessage } = JSON.parse(new TextDecoder().decode(bs58.decode(payload)));

      try {
        nacl.sign.detached.verify(
          new TextEncoder().encode(authMessage),
          bs58.decode(signature),
          bs58.decode(publicKey),
        );
      } catch (error) {
        throw new AuthException('Cannot authorize the user with provided credentials.');
      }

      const user = await this.userService.findOne({ where: { walletPublicKey: publicKey } });

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userService.update(user.id, { refreshToken });

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('Cannot authorize the user with provided credentials.');
    }
  }

  public async refresh(refreshDto: RefreshDto): Promise<RefreshResponse> {
    const userWithValidRefreshToken = await this.userService.findOne({
      where: {
        refreshToken: refreshDto.refreshToken,
      },
    });

    const { accessToken, refreshToken } =
      await this.generateJwtTokensPair(userWithValidRefreshToken);

    await this.userService.update(userWithValidRefreshToken.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  public async logout(logoutDto: LogoutDto): Promise<UserPublicEntity> {
    return this.userService.update(logoutDto.userId, { refreshToken: null });
  }

  public async generateGoogleOAuth2Url(payload: OAuth2Payload): Promise<string | never> {
    return this.googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
      state: JSON.stringify(payload),
    });
  }

  public async generateGoogleOAuth2Token(
    code: string,
    state: any,
  ): Promise<GenerateGoogleOAuth2Response | never> {
    try {
      try {
        const { tokens } = await this.googleOAuth2Client.getToken(code || '');
        const { email } = await this.googleOAuth2Client.getTokenInfo(tokens.access_token || '');

        const response = await this.httpService.axiosRef.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          },
        );

        const { given_name: firstName, family_name: lastName } = response.data;

        if (!tokens.access_token || !email) {
          throw new AuthException('Cannot authenticate the user with provided credentials');
        }

        const token = this.jwtService.sign(
          {
            email,
            firstName,
            lastName,
            accessToken: tokens.access_token,
            referer: state.referer,
          },
          { expiresIn: this.configService.get<string>(ConfigVariables.JwtOAuth2TokenDuration) },
        );

        return { token };
      } catch (error: any) {
        if (error instanceof AuthException) {
          throw error;
        }

        throw new ServerException('Internal server error');
      }
    } catch (error: any) {
      const token = await this.jwtService.sign(
        {
          error: error.message,
          referer: state.referer,
        },
        { expiresIn: this.configService.get<string>(ConfigVariables.JwtOAuth2TokenDuration) },
      );

      return { token };
    }
  }

  public async generateDiscordOAuth2Url(payload: OAuth2Payload): Promise<string | never> {
    const clientId = this.configService.get<string>(ConfigVariables.DiscordClientId);
    const state = JSON.stringify(payload);
    const redirectUri = `${this.configService.get<string>(ConfigVariables.ServerUri)}/oauth2/callback/discord`;

    return `https://discord.com/oauth2/authorize?response_type=code&client_id=${clientId}&scope=email%20identify&state=${state}&redirect_uri=${redirectUri}&prompt=consent`;
  }

  public async generateDiscordOAuth2Token(
    code: string,
    state: any,
  ): Promise<GenerateDiscordOAuth2Response | never> {
    try {
      try {
        const clientId = this.configService.get<string>(ConfigVariables.DiscordClientId);
        const clientSecret = this.configService.get<string>(ConfigVariables.DiscordClientSecret);
        const redirectUri = `${this.configService.get<string>(ConfigVariables.ServerUri)}/oauth2/callback/discord`;

        const tokenResponse = await this.httpService.axiosRef.post(
          'https://discord.com/api/oauth2/token',
          new URLSearchParams({
            client_id: clientId || '',
            client_secret: clientSecret || '',
            grant_type: 'authorization_code',
            redirect_uri: redirectUri || '',
            code: code || '',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

        const { access_token } = tokenResponse.data;

        const userResponse = await this.httpService.axiosRef.get(
          'https://discordapp.com/api/users/@me',
          {
            headers: { Authorization: `Bearer ${access_token}` },
          },
        );

        const { email } = userResponse.data;

        if (!access_token || !email) {
          throw new AuthException('Cannot authenticate the user with provided credentials');
        }

        const token = this.jwtService.sign(
          {
            email,
            accessToken: access_token,
            referer: state.referer,
          },
          { expiresIn: this.configService.get<string>(ConfigVariables.JwtOAuth2TokenDuration) },
        );

        return { token };
      } catch (error: any) {
        if (error instanceof AuthException) {
          throw error;
        }

        throw new ServerException('Internal server error');
      }
    } catch (error: any) {
      const token = await this.jwtService.sign(
        {
          error: error.message,
          referer: state.referer,
        },
        { expiresIn: this.configService.get<string>(ConfigVariables.JwtOAuth2TokenDuration) },
      );

      return { token };
    }
  }

  private async generateJwtTokensPair(user: UserPublicEntity): Promise<JwtTokensPairResponse> {
    const accessToken = this.jwtService.sign(
      {
        iat: Number((Date.now() / 1000).toFixed(0)),
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: this.configService.get<string>(ConfigVariables.JwtAccessTokenDuration) },
    );

    const refreshToken = this.jwtService.sign(
      {
        iat: Number((Date.now() / 1000).toFixed(0)),
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: this.configService.get<string>(ConfigVariables.JwtRefreshTokenDuration) },
    );

    return { accessToken, refreshToken };
  }
}
