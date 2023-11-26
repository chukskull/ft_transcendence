import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ChatGateway } from './chat.gateway';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Chat } from './conversation.entity';
import { NotifGateway } from '../notifications.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from '../user/user.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/channel.entity';
@Module({
  controllers: [ConversationController],
  imports: [TypeOrmModule.forFeature([User, Conversation, Chat, Channel])],
  providers: [
    ConversationService,
    ChatGateway,
    NotifGateway,
    JwtService,
    UserService,
    AuthService,
    ChannelService,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
