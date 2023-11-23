import { Injectable } from '@nestjs/common';
import { Conversation, Chat } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NotifGateway } from '../notifications.gateway';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    @Inject(NotifGateway) private readonly notifGateway: NotifGateway,
  ) {}

  async getMyDms(MyUser: number) {
    MyUser = 1;
    const user = await this.UserRepository.findOne({
      where: { id: MyUser },
      relations: [
        'conversations',
        'conversations.members',
        'conversations.chats',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    user.conversations.filter((conv) => conv.is_group === false);
    // remove user from members
    user.conversations.forEach((conv) => {
      conv.members = conv.members.filter((member) => member.id !== MyUser);
    });
    return user.conversations;
  }
  async getConversation(convId: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const myUser = 1;
    const user = conv.members.find((member) => member.id === myUser);
    if (!user)
      throw new NotFoundException('User not found in this conversation');

    conv.members = conv.members.filter((member) => member.id !== myUser);
    return conv;
  }

  async addMessageToConversation(convId: number, message: Chat, sender: User) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    const user = conv.members?.find((member) => member.id === sender.id);
    if (!user)
      throw new NotFoundException('User not found in this conversation');
    try {
      conv.chats.push(message);
      if (!conv.is_group) {
        const otherUser = conv.members.find(
          (member) => member.id !== sender.id,
        );
        this.notifGateway.newMessage(message, otherUser.id);
      }
      await this.conversationRepository.save(conv);
    } catch (e) {
      console.log(e);
    }
  }

  async createConversation(meId: number, friendId: number) {
    const newConversation = await this.conversationRepository.create();
    newConversation.is_group = friendId ? false : true;
    newConversation.members = [];
    newConversation.chats = [];
    const me = await this.UserRepository.findOne({ where: { id: meId } });
    newConversation.members.push(me);
    if (friendId) {
      const friend = await this.UserRepository.findOne({
        where: { id: friendId },
      });
      newConversation.members.push(friend);
    }
    return this.conversationRepository.save(newConversation);
  }
}
