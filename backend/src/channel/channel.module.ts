// app/channel/channel.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Channel, Conversation, User])],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
