import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { AuthService } from 'src/modules/auth/auth.service';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { RegisterWithCredentialsDto } from 'src/modules/auth/DTO/register-with-credentials.dto';
import { UserRegistrationMethods } from '@prisma/client';
import { UserRoles } from 'src/modules/user/types/user.types';
import { RegisterWithGoogleDto } from 'src/modules/auth/DTO/register-with-google.dto';
import { RegisterWithDiscordDto } from 'src/modules/auth/DTO/register-with-discord.dto';
import { RegisterWithSolanaWalletDto } from 'src/modules/auth/DTO/register-wtih-solana-wallet.dto';
import { LoginWithCredentialsDto } from 'src/modules/auth/DTO/login-with-credentials.dto';
import { JwtRefreshAuthGuard } from 'src/modules/auth/guards/jwt-refresh-auth.guard';
import { LoginWithGoogleDto } from 'src/modules/auth/DTO/login-with-google.dto';
import { LoginWithDiscordDto } from 'src/modules/auth/DTO/login-with-discord.dto';
import { LoginWithSolanaWalletDto } from 'src/modules/auth/DTO/login-with-solana-wallet.dto';
import { LoginResponse, RefreshResponse, RegisterResponse } from 'src/core/types/auth.types';

@ApiTags(RoutesApiTags[Routes.Auth])
@Controller(Routes.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({ description: 'The authenticated user.', type: UserPublicEntity })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Get('/user')
  public async user(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
  ): Promise<UserPublicEntity> {
    return authenticatedUser;
  }

  @ApiCreatedResponse({
    description: 'User was successfully registered with credentials.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot register the user with credentials. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/register/credentials')
  public async registerWithCredentials(
    @Body() registerWithCredentialsDto: RegisterWithCredentialsDto,
    @Res() response: Response,
  ): Promise<Response<RegisterResponse>> {
    const user = await this.authService.register({
      userRegistrationMethod: UserRegistrationMethods.Credentials,
      role: UserRoles.User,
      ...registerWithCredentialsDto,
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully registered with Google.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot register the user with Google. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/register/google')
  public async registerWithGoogle(
    @Body() registerWithGoogleDto: RegisterWithGoogleDto,
    @Res() response: Response,
  ): Promise<Response<RegisterResponse>> {
    const user = await this.authService.register({
      userRegistrationMethod: UserRegistrationMethods.Google,
      role: UserRoles.User,
      ...registerWithGoogleDto,
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully registered with Discord.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot register the user with Discord. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/register/discord')
  public async registerWithDiscord(
    @Body() registerWithDiscordDto: RegisterWithDiscordDto,
    @Res() response: Response,
  ): Promise<Response<RegisterResponse>> {
    const user = await this.authService.register({
      userRegistrationMethod: UserRegistrationMethods.Discord,
      role: UserRoles.User,
      ...registerWithDiscordDto,
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully registered with Solana Wallet.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot register the user with Solana Wallet. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/register/wallet/solana')
  public async registerWithSolanaWallet(
    @Body() registerWithSolanaWalletDto: RegisterWithSolanaWalletDto,
    @Res() response: Response,
  ): Promise<Response<RegisterResponse>> {
    const user = await this.authService.register({
      userRegistrationMethod: UserRegistrationMethods.SolanaWallet,
      role: UserRoles.User,
      ...registerWithSolanaWalletDto,
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with credentials.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Cannot log in the user with credentials.' })
  @ApiConflictResponse({
    description: 'Cannot log in the user with loginWithCredentialsDto. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/login/credentials')
  public async loginWithCredentials(
    @Body() loginWithCredentialsDto: LoginWithCredentialsDto,
    @Res() response: Response,
  ): Promise<Response<LoginResponse>> {
    const user = await this.authService.loginWithCredentials(loginWithCredentialsDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with Google.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Cannot log in the user with Google.' })
  @ApiConflictResponse({
    description: 'Cannot log in the user with Google. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/login/google')
  public async loginWithGoogle(
    @Body() loginWithGoogleDto: LoginWithGoogleDto,
    @Res() response: Response,
  ): Promise<Response<LoginResponse>> {
    const user = await this.authService.loginWithGoogle(loginWithGoogleDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with Discord.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Cannot log in the user with Discord.' })
  @ApiConflictResponse({
    description: 'Cannot log in the user with Discord. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/login/discord')
  public async loginWithDiscord(
    @Body() loginWithDiscordDto: LoginWithDiscordDto,
    @Res() response: Response,
  ): Promise<Response<LoginResponse>> {
    const user = await this.authService.loginWithDiscord(loginWithDiscordDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with Solana Wallet.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Cannot log in the user with Solana Wallet.' })
  @ApiConflictResponse({
    description: 'Cannot log in the user with Solana Wallet. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/login/wallet/solana')
  public async loginWithSolanaWallet(
    @Body() loginWithSolanaWalletDto: LoginWithSolanaWalletDto,
    @Res() response: Response,
  ): Promise<Response<LoginResponse>> {
    const user = await this.authService.loginWithSolanaWallet(loginWithSolanaWalletDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @Auth(JwtRefreshAuthGuard)
  @ApiCreatedResponse({
    description: 'User refresh and access tokens were successfully updated.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({
    description: "Cannot update user's refresh and access tokens. Invalid data was provided.",
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<RefreshResponse>> {
    const { accessToken, refreshToken } = await this.authService.refresh({
      refreshToken:
        request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token'],
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', refreshToken, {
        httpOnly: true,
      })
      .json({ accessToken, refreshToken });
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The user was successfully logged out.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({ description: 'The user is unauthorized.' })
  @ApiForbiddenResponse({ description: 'The user is forbidden to perform this action.' })
  @ApiConflictResponse({ description: 'Cannot log out the user. Invalid data was provided.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('/logout')
  public async logout(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Res() response: Response,
  ): Promise<Response<UserPublicEntity>> {
    const user = await this.authService.logout({ userId: authenticatedUser.id });

    return response
      .status(HttpStatus.CREATED)
      .clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token', {
        httpOnly: true,
      })
      .clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token', {
        httpOnly: true,
      })
      .json(user);
  }
}
