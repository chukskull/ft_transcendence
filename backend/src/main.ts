import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: "http://localhost:1337",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
  await app.listen(1337);
}
bootstrap();
