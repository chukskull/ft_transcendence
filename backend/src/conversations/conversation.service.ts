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
    const MyUser = 1;
    const user = await this.UserRepository.findOne({ where: { id: MyUser } });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      const myConvs = await this.conversationRepository.find({
        where: { members: user, is_group: false },
        relations: ['members', 'chats'],
      });
      myConvs.forEach((conv) => {
        conv.members = conv.members.filter((member) => member.id !== MyUser);
      });
      return myConvs;
    }
  }
  async getConversation(convId: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    } else {
      const myUser = 1;
      // check if user is in the conversation
      const user = conv.members.find((member) => member.id === myUser);
      if (!user) {
        throw new NotFoundException('User not found in this conversation');
      } else {
        conv.members = conv.members.filter((member) => member.id !== myUser);
        return conv;
      }
    }
  }

  async addMessageToConversation(convId: number, message: Chat) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
    });
    conv.chats.push(message);
  }

  async createConversation() {
    const newConversation = await this.conversationRepository.create();
    newConversation.is_group = false;
    newConversation.members = [];
    newConversation.chats = [];
    console.log(newConversation);
    const user1 = await this.UserRepository.findOne({ where: { id: 1 } });
    const user2 = await this.UserRepository.findOne({ where: { id: 2 } });
    newConversation.members.push(user1);
    newConversation.members.push(user2);
    return this.conversationRepository.save(newConversation);
  }
}