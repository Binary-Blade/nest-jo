import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/globals-filter/http-exceptions-filter';
import { WinstonLoggerService } from '@common/logger/winston.service';
import { ConfigService } from '@nestjs/config';
import { runMigrations } from '@database/migration-runner';
import { PROD_ENV } from '@utils/constants/constants.env';

/**
 * The bootstrap function to set up and start the NestJS application.
 * @async
 * @function bootstrap
 *
 * @example
 * bootstrap();
 */
async function bootstrap() {
  // Create the NestJS application with custom Winston logger
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService() // Custom Winston logger
  });

  // Get the configuration service
  const configService = app.get(ConfigService);

  // Enable CORS for the frontend URL
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    credentials: true, // Important for cookies/session to work across origins
    allowedHeaders: 'Content-Type, Authorization'
  });

  // Run database migrations
  await runMigrations();

  // Middleware for parsing cookies and setting security headers
  app.use(cookieParser());
  app.use(helmet());

  // Log the environment mode
  if (process.env.NODE_ENV === PROD_ENV) {
    console.log('================ Environnement de production ================');
  } else {
    console.log('================ Environnement de développement ================');
  }

  // Globally applied pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true // Throw an error when non-whitelisted properties are present
    })
  );

  // Globally applied filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Listening on a port defined in the environment or a default
  await app.listen(configService.get('PORT', 3000));
}

// Initialize the application
bootstrap();
