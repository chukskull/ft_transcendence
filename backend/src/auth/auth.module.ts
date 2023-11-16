// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: '42' })],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
