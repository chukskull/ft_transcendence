import { Controller } from '@nestjs/common';
import { Get, Param, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtGuard } from 'src/auth/Jwt.guard';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly authService: AuthService,
  ) {}

  @Get(':convId')
  @UseGuards(JwtGuard)
  async getConversation(@Param('convId') convId: number, @Req() req) {
    return this.conversationService.getConversation(convId, req.user.id);
  }

  @Get()
  @UseGuards(JwtGuard)
  async MyDms(@Req() req) {
    return this.conversationService.getMyDms(req.user.id);
  }
}
