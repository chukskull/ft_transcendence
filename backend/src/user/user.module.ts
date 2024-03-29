import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Channel } from '../channel/channel.entity';
import { Conversation, Chat } from '../conversations/conversation.entity';
import { Achievement } from '../achievement/achievement.entity';
import { ChannelService } from 'src/channel/channel.service';
import { ConversationService } from '../conversations/conversation.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Conversation, Achievement, Chat]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ChannelService,
    ConversationService,
  ],
  exports: [UserService],
})
export class UserModule {}
