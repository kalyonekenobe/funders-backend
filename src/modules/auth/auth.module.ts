import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/modules/auth/strategies/jwt-refresh.strategy';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { SolanaService } from 'src/modules/solana/solana.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigVariables.JwtSecret),
        signOptions: {
          audience: configService.get<string>(ConfigVariables.JwtAudience),
          issuer: configService.get<string>(ConfigVariables.JwtIssuer),
          expiresIn: configService.get<string>(ConfigVariables.JwtAccessTokenDuration),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    SolanaService,
  ],
})
export class AuthModule {}
