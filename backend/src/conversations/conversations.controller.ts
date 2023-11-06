import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(':convId')
  getConversation(@Param('convId') convId: number) {
    return this.conversationsService.getConversation(convId);
  }
}
