import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [PassportModule.register({session: false})],
  controllers: [AuthController],
  providers: [AuthService, JwtService, HttpService],
})
export class AuthModule {}
