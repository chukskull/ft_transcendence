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
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async getMyDms() {
    const user = await this.UserRepository.findOne({ where: { id: 1 } });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      const myConvs = await this.conversationRepository.find({
        where: { members: user, is_group: false },
      });
      // remove my user from members
      myConvs.forEach((conv) => {
        conv.members = conv.members.filter((member) => member.id !== 1);
      });
      return myConvs;
    }
  }
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
        const newConversation = await this.conversationRepository.create();
        // newConversation.members.push(user);
        // newConversation.members.push(myUser);
        return this.conversationRepository.save(newConversation);
      }
    } catch (err) {
      return err;
    }
  }
}
