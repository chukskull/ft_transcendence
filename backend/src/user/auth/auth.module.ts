import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from 'passport-42';
import { PassportModule } from '@nestjs/passport';
import { FtOauthGuard } from '../guards/ft_oauth.guard';
import { OAuth2Strategy } from './42.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'fortyTwo' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FtOauthGuard, OAuth2Strategy],
})
export class AuthModule {}
