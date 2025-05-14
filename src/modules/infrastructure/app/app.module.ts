import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { FundersCoreProgramModule } from 'src/modules/infrastructure/funders-core-program/funders-core-program.module';
import { LoggerModule } from 'src/modules/infrastructure/logger/logger.module';
import { LoggerMiddleware } from 'src/modules/infrastructure/logger/middlewares/logger.middleware';
import { PasswordModule } from 'src/modules/infrastructure/password/password.module';
import { PasswordModuleOptions } from 'src/modules/infrastructure/password/types/password.types';
import { PrismaModule } from 'src/modules/infrastructure/prisma/prisma.module';
import { RedisModule } from 'src/modules/infrastructure/redis/redis.module';
import { RedisModuleOptions } from 'src/modules/infrastructure/redis/types/redis.types';
import { StripeModule } from 'src/modules/infrastructure/stripe/stripe.module';
import { StripeModuleOptions } from 'src/modules/infrastructure/stripe/types/stripe.types';
import { SupabaseModule } from 'src/modules/infrastructure/supabase/supabase.module';
import { SupabaseModuleOptions } from 'src/modules/infrastructure/supabase/types/supabase.types';
import { PostModule } from 'src/modules/post/post.module';
import { SolanaModule } from 'src/modules/solana/solana.module';
import { UserModule } from 'src/modules/user/user.module';
import { UtilsModule } from 'src/modules/utils/utils.module';
import * as winston from 'winston';
import * as path from 'path';
import { PaymentModule } from 'src/modules/infrastructure/payment/payment.module';
import { GeminiModule } from 'src/modules/infrastructure/gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./env/.env.development'],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>(ConfigVariables.SupabaseJwtSecret),
        signOptions: {
          audience: configService.get<string>(ConfigVariables.JwtAudience),
          issuer: configService.get<string>(ConfigVariables.JwtIssuer),
          expiresIn: configService.get<string>(ConfigVariables.JwtAccessTokenDuration),
        },
      }),
      inject: [ConfigService],
    }),
    SupabaseModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<SupabaseModuleOptions> => ({
        supabaseUrl: configService.get<string>(ConfigVariables.SupabaseUrl) || '',
        supabaseKey: configService.get<string>(ConfigVariables.SupabaseKey) || '',
        supabaseBucketName: configService.get<string>(ConfigVariables.SupabaseBucketName) || '',
        supabaseJwtSecret: configService.get<string>(ConfigVariables.SupabaseJwtSecret) || '',
      }),
      inject: [ConfigService, JwtService],
    }),
    PasswordModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<PasswordModuleOptions> => ({
        saltPrefix: configService.get<string>(ConfigVariables.UserPasswordSaltPrefix) || '',
        saltSuffix: configService.get<string>(ConfigVariables.UserPasswordSaltSuffix) || '',
        saltRounds: configService.get<number>(ConfigVariables.UserPasswordSaltRounds) || 0,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<WinstonModuleOptions> => ({
        transports: [
          new winston.transports.Console({
            level: configService.get<string>(ConfigVariables.DefaultLogLevel) || 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf(log => {
                const trace = log.trace ? `\n[${log.trace}]` : '';
                const correlationId = log.correlationId ? `[${log.correlationId}] ` : '';
                const module = !log.module
                  ? ''
                  : configService.get<string>(ConfigVariables.NodeEnv) === 'development'
                    ? `\x1b[33m[${log.module}]\x1b[0m`
                    : `[${log.module}]`;

                return `[${log.level}] ${correlationId}${module} ${log.message} ${trace}`;
              }),
              ...(configService.get<string>(ConfigVariables.NodeEnv) === 'development'
                ? [winston.format.colorize({ all: true, level: true })]
                : []),
            ),
          }),
        ],
      }),
    }),
    StripeModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<StripeModuleOptions> => ({
        secretKey: configService.get<string>(ConfigVariables.StripeSecretKey) || '',
        options: {
          apiVersion: '2025-04-30.basil',
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
        nodes: `${configService.get<string>(ConfigVariables.RedisHost)}:${configService.get<string>(ConfigVariables.RedisPort)}`,
        username: configService.get<string>(ConfigVariables.RedisUsername) || '',
        password: configService.get<string>(ConfigVariables.RedisPassword) || '',
        tlsEnabled: Boolean(configService.get<string>(ConfigVariables.RedisTlsEnabled) === 'true'),
        ca: Buffer.from(configService.get<string>(ConfigVariables.RedisTlsCa) || ''),
        key: Buffer.from(configService.get<string>(ConfigVariables.RedisTlsKey) || ''),
        cert: Buffer.from(configService.get<string>(ConfigVariables.RedisTlsCert) || ''),
      }),
      inject: [ConfigService],
    }),
    FundersCoreProgramModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        fundersCoreProgramId: configService.get<string>(ConfigVariables.FundersCoreProgramId) || '',
        solanaRpcHttpEndpoint:
          configService.get<string>(ConfigVariables.SolanaRpcHttpEndpoint) || '',
      }),
      inject: [ConfigService],
    }),
    GeminiModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>(ConfigVariables.GeminiApiKey) || '',
        model: configService.get<string>(ConfigVariables.GeminiModel) || '',
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    LoggerModule,
    UserModule,
    AuthModule,
    PostModule,
    ChatModule,
    SolanaModule,
    UtilsModule,
    PaymentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
