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
    const user = await this.UserRepository.findOne({
      where: { id: MyUser },
      relations: [
        'conversations',
        'conversations.members',
        'conversations.chats',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    user.conversations = user.conversations.filter(
      (conv) => conv.is_group === false,
    );
    user.conversations.forEach((conv) => {
      conv.members = conv.members.filter((member) => member.id !== MyUser);
    });
    return user.conversations;
  }
  async getConversation(convId: number, myUser: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const user = conv.members.find((member) => member.id === myUser);
    if (!user)
      throw new NotFoundException('User not found in this conversation');

    conv.members = conv.members.filter((member) => member.id !== myUser);
    return conv;
  }

  async addMessageToConversation(
    convId: number,
    message: Chat,
    senderId: number,
  ) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    const user = conv.members?.find((member) => member.id === senderId);
    if (!user)
      throw new NotFoundException('User not found in this conversation');
    try {
      conv.chats.push(message);
      if (!conv.is_group) {
        const otherUser = conv.members.find((member) => member.id !== senderId);
        this.notifGateway.newMessage(message, otherUser.id);
      }
      await this.conversationRepository.save(conv);
      console.log(conv);
    } catch (e) {
      console.log(e);
    }
  }

  async createConversation(meId: number, friendId: number) {
    const me = await this.fetchUserWithConversations(meId);
    const friend = friendId
      ? await this.fetchUserWithConversations(friendId)
      : null;

    const newConversation = this.conversationRepository.create({
      is_group: !friendId,
      members: [me],
      chats: [],
    });

    if (friend) {
      newConversation.members.push(friend);
      friend.conversations.push(newConversation);
      await Promise.all([
        this.UserRepository.save(friend),
        this.UserRepository.save(me),
      ]);
    }

    me.conversations.push(newConversation);
    await this.UserRepository.save(me);

    return this.conversationRepository.save(newConversation);
  }

  private async fetchUserWithConversations(userId: number) {
    return this.UserRepository.findOne({
      where: { id: userId },
      relations: [
        'conversations',
        'conversations.members',
        'conversations.chats',
      ],
    });
  }
}
