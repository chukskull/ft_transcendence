import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategies/fortytwo.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({session: false})],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy],
})
export class AuthModule {}
