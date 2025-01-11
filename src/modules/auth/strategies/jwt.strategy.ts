import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { JwtTokenPayload } from 'src/modules/auth/types/auth.types';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/core/enums/app.enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies[
            configService.get<string>(ConfigVariables.CookieAccessTokenName) ||
              'Funders-Access-Token'
          ] || request.headers.authorization?.replace('Bearer ', ''),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigVariables.JwtSecret),
    });
  }

  public async validate(payload: JwtTokenPayload): Promise<UserPublicEntity> {
    return this.userService.findOne({ where: { id: payload.userId } });
  }
}
