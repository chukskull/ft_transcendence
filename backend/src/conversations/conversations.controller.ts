import { Controller } from '@nestjs/common';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(':convId')
  getConversation(@Param('convId') convId: number) {
    return this.conversationsService.getConversation(convId);
  }
}
