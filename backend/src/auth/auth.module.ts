import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';
import { UserRepository } from 'src/users/users.repository'

@Module({
  imports: [PassportModule.register({session: false})],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, JwtService, UsersService, HttpService, UserRepository],
})
export class AuthModule {}
