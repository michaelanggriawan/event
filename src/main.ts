import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpSuccessInterceptor } from './interceptors/success.interceptor';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { AllExceptionFilter } from './interceptors/error.interceptor';
import 'winston-daily-rotate-file';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // we also want to see logs in our console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(app.get(Logger)));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new HttpSuccessInterceptor());
  app.enableCors();
  const configService = app.get(ConfigService);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('event API')
    .setDescription('event APIs doc')
    .setVersion('1.0')
    .addTag('events')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/event/docs', app, document);

  await app.listen(configService.get<string>('SERVER_PORT'));
}
bootstrap();
