import { User, UserRole } from '@prisma/client';

export interface LoginResponse extends Omit<User, 'password'> {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface RegisterResponse extends Omit<User, 'password'> {
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
  userId: User['id'];
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
