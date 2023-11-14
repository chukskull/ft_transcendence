import { Controller } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':convId')
  async getConversation(@Param('convId') convId: number) {
    return this.conversationService.getConversation(convId);
  }

  @Post('create')
  async getConversations() {
    return this.conversationService.createConversation();
  }

  @Get('/myDms')
  async getMyDms() {
    return this.conversationService.getMyDms();
  }
}
