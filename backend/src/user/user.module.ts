import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { Channel } from '../channel/channel.entity';
import { Conversation } from '../conversations/conversation.entity';
import { Achievement } from '../achievement/achievement.entity';
import { AuthService } from 'src/auth/auth.service';
import { FortyTwoStrategy } from 'src/auth/auth.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Conversation, Achievement]),
    PassportModule.register({ defaultStrategy: '42' }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, FortyTwoStrategy],
  exports: [UserService],
})
export class UserModule {}
