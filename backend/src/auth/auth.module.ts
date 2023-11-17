import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule ,PassportModule.register({ defaultStrategy: '42' }), JwtModule.register({secret: "secret", signOptions: { expiresIn: '30d'}})],
  providers: [AuthService, FortyTwoStrategy],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy],
})
export class AuthModule {}