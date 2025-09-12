import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import csurf from 'csurf';
import session from 'express-session';
import { AppModule } from './app.module';
import { LoggerMiddleware } from '@middleware/logger/loggerMiddleware';
import { AllExceptionsFilter } from '@common/filter/exceptions.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // catch shutdown signals
  app.enableShutdownHooks();

  // Enable global validation pipe, check for validation errors in DTO -> return 400 Bad Request if failed
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  });

  app.use(helmet());

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true },
  }));

  //Cross-Site Request Forgery
  app.use(csurf());

  // logger middleware
  app.use(new LoggerMiddleware().use);

  // global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // global interceptor to transform response structure
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
