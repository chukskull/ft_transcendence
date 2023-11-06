import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':convId')
  getConversation(@Param('convId') convId: number) {
    return this.conversationService.getConversation(convId);
  }
}
