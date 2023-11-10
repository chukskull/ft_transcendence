/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Conversation, Chat } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private UserRepository: Repository<User>,
  ) {}

  async getConversation(convId: number) {
    return `This action returns a #${convId} conversation`;
  }

  async addMessageToConversation(convId: number, message: Chat) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
    });
    conv.chats.push(message);
  }

  async startConversation(userId: number) {
    try {
      const user = await this.UserRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      } else {
        const newConversation = new Conversation();
        // newConversation.members.push(user);
        // newConversation.members.push(myUser);
        return this.conversationRepository.save(newConversation);
      }
    } catch (err) {
      return err;
    }
  }
}
