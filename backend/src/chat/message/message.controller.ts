import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { message } from './message.entity';
import { verifyUser } from 'src/user/auth/strategies/auth.guard';
import { messageDto } from './message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(verifyUser)
  @Get()
  async findAllMessages(): Promise<message[]> {
    return this.messageService.findAllMessages();
  }

  @UseGuards(verifyUser)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<message[]> {
    const channelId = parseInt(id);
    return this.messageService.findChannelMessages(channelId);
  }

  @UseGuards(verifyUser)
  @Post()
  async create(@Body() message: messageDto): Promise<message> {
    return this.messageService.createMessage(message);
  }
}
