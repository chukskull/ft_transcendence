import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from './UserService';
import { JwtService } from '@nestjs/jwt';
import { Channel } from '../channel/channel.entity';
import { Conversation } from '../conversations/conversation.entity';
import { Achievement } from '../achievement/achievement.entity';
import { AuthService } from 'src/auth/auth.service';
import { NotifGateway } from 'src/notifications.gateway';
import { ChannelService } from 'src/channel/channel.service';
import { ConversationService } from '../conversations/conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Conversation, Achievement]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    NotifGateway,
    JwtService,
    ChannelService,
    ConversationService,
  ],
  exports: [UserService],
})
export class UserModule {}
