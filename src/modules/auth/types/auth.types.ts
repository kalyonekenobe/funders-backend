import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface LoginResponse extends Omit<UserEntity, 'password' | 'refreshToken'> {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface RegisterResponse extends Omit<UserEntity, 'password' | 'refreshToken'> {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokensPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokenPayload {
  userId: UserEntity['id'];
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface AuthGuardOptions {
  permissions?: number;
}

export interface OAuth2Payload {
  referer: string;
}

export interface GenerateGoogleOAuth2Response {
  token: string;
}

export interface GenerateDiscordOAuth2Response {
  token: string;
}

export interface GetSolanaWalletSignInMessageResponse {
  message: string;
}
