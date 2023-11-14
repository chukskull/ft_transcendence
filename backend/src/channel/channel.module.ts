// app/channel/channel.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Conversation } from '../conversations/conversation.entity';
import { ConversationService } from '../conversations/conversation.service';
import { ConversationModule } from 'src/conversations/conversation.module';
import { User } from '../user/user.entity';
@Module({
  imports: [
    ConversationModule,
    TypeOrmModule.forFeature([Channel, Conversation, User]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ConversationService],
})
export class ChannelModule {}
