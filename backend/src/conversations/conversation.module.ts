import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ChatGateway } from './chat.gateway';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { NotifGateway } from '../notifications.gateway';
@Module({
  controllers: [ConversationController],
  imports: [TypeOrmModule.forFeature([User, Conversation])],
  providers: [ConversationService, ChatGateway, NotifGateway],
})
export class ConversationModule {}
