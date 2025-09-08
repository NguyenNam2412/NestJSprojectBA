import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import csurf from 'csurf';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe, check for validation errors in DTO -> return 400 Bad Request if failed
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(helmet());

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true },
  }));

  app.use(csurf());

  await app.listen(5000);
}
bootstrap();
