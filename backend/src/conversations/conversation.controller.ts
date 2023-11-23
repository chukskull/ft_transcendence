import { Controller } from '@nestjs/common';
import { Get, Param, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':convId')
  async getConversation(@Param('convId') convId: number) {
    return this.conversationService.getConversation(convId);
  }

  @Get()
  async MyDms(@Req() req) {
    // if (!req.user) {
    //   return [];
    // }
    return this.conversationService.getMyDms(1);
  }
}
