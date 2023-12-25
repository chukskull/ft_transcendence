import { Injectable } from '@nestjs/common';
import { Conversation, Chat } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
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
      relations: ['members', 'chats', 'MutedUsers'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    const user = conv.members.map((member) => member.id == senderId);
    if (!user)
      throw new NotFoundException('User not found in this conversation');
    const isMuted = conv.MutedUsers.find((member) => member.id == senderId);
    if (isMuted) {
      return null;
    }
    try {
      conv.chats.push(message);
      await this.conversationRepository.save(conv);
    } catch (e) {
      console.log(e);
    }
  }

  async createConversation(
    meId: number,
    friendId?: number,
  ): Promise<Conversation> {
    const [me, friend] = await Promise.all([
      this.fetchUserWithConversations(meId),
      friendId
        ? this.fetchUserWithConversations(friendId)
        : Promise.resolve(null),
    ]);

    const newConversation = this.conversationRepository.create({
      is_group: !friendId,
      members: [me],
      chats: [],
    });

    if (friend) {
      newConversation.members.push(friend);
    }
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

  async joinConversation(convId: number, userId: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    const user = await this.UserRepository.findOne({
      where: { id: userId },
      relations: ['conversations', 'conversations.members'],
    });
    if (!user) throw new NotFoundException('User not found');

    const isMember = conv.members.find((member) => member.id === userId);
    if (isMember) return null;

    conv.members.push(user);
    user.conversations.push(conv);
    await Promise.all([
      this.conversationRepository.save(conv),
      this.UserRepository.save(user),
    ]);
    return conv;
  }

  // deleteConversation(convId: number)
  async deleteConversation(convId: number) {
    const conv = await this.conversationRepository.findOne({
      where: { id: convId },
      relations: ['members', 'chats'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    await this.conversationRepository.remove(conv);
  }
}
