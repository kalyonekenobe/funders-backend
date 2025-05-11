import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from 'src/core/filters/exception.filter';
import { configurePrismaDecimalJSONStringifyOutput } from 'src/core/utils/decimal.utils';
import { configurePrismaBigIntJSONStringifyOutput } from 'src/core/utils/bigint.utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/modules/infrastructure/app/app.module';
import { configureCorsAllowedOriginsList } from 'src/modules/infrastructure/app/utils/app.utils';
import ValidationPipes from 'src/core/config/validation.pipes';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(ValidationPipes.validationPipe);
  app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));

  const config = new DocumentBuilder()
    .setTitle('Funders')
    .setDescription('The Funders API')
    .setVersion('0.1')
    .build();

  app.enableCors({
    origin: configureCorsAllowedOriginsList(process.env.CORS_ALLOWED_ORIGINS || ''),
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE, CONNECT',
    credentials: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  configurePrismaDecimalJSONStringifyOutput();
  configurePrismaBigIntJSONStringifyOutput();

  await app.listen(process.env.BACKEND_PORT || 8000);
};

bootstrap();
