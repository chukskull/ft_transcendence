import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AppModule } from 'src/app.module';
import { GoogleStrategy } from './google.strategy';


@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({
      secret: "f439843--213+@y4t34u",
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, FortyTwoStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
