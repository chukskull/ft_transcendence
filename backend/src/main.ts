import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { serialize } from 'v8';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(bodyParser.json({ limit: '2mb' }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(1337);
}
bootstrap();
