import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ChatGateway } from './chat.gateway';
@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ChatGateway],
  

})
export class ConversationModule {}
