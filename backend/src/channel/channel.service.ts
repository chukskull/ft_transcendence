// app/channel/channel.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Conversations } from '../conversations/conversations.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private conversationRepository: Repository<Conversations>,
  ) {}
  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const { name, is_private, password } = createChannelDto;
    const channel = new Channel();
    channel.name = name;
    channel.is_private = is_private;
    if (password) {
      channel.password = password;
      channel.is_protected = true;
    }
    else 
      channel.is_protected = false;
    
    channel.conversation = new Conversations();
    // channel.members.push();
    console.log(channel); 
    return this.channelRepository.save(channel);
  }

  async getChannels(): Promise<Channel[]> {
    // Return all non-private channels
    return this.channelRepository.find();
  }
  async getChannel(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne(id);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async updateChannel(
    updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    const { id, name, is_private, password } = updateChannelDto;

    const channel = await this.channelRepository.findOne({ id });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (password && password.length > 5) {
      channel.password = password;
      channel.is_protected = true;
    }
    else 
      channel.is_protected = false;

    if (name) {
      channel.name = name;
    }
    channel.is_private = is_private;

    return this.channelRepository.save(channel);
  }

  async deleteChannel(id: number): Promise<void> {
    const channel = await this.channelRepository.findOne(id);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    await this.channelRepository.remove(channel);
  }

  async joinChannel(chanId: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ id: chanId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const userId = 14124;

    // check if user is already in channel members list
    const isAlreadyMember = channel.members.some(
      (member) => member.id === userId,
    );
    if (isAlreadyMember) {
      throw new NotFoundException('User already in channel');
    }
    else {
      channel.members.push(new User());
    }

    return this.channelRepository.save(channel);
  }

  async leaveChannel(chanId: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ id: chanId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const userId = 14124;
    // Remove user from channel.members list
    channel.members = channel.members.filter((member) => member.id !== userId);


    return this.channelRepository.save(channel);
  }

  async inviteToChannel(chanId: number, userId: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ id: chanId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const isAlreadyMember = channel.members.some(
      (member) => member.id === userId,
    );

    if (isAlreadyMember) {
      throw new NotFoundException('User already in channel');
    }
    else {
      channel.members.push(new User());
    }

    return this.channelRepository.save(channel);
  }

  async banUnbanFromChannel(chanId: number, userId: number, action: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ id: chanId });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const conv = await this.conversationRepository.findOne({ id: channel.conversation.id });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }
    if (action == 1) {
      // check if user is already in channel banned list
      const isAlreadyBanned = channel.BannedUsers.some(
        (member) => member.id === userId,
      );
      if (isAlreadyBanned) {
        throw new NotFoundException('User already banned from channel');
      }
      else {
        channel.BannedUsers.push(new User());
        conv.BannedUsers.push(new User());
      }
    }
    else {
      // Remove user from channel.members list
      channel.BannedUsers = channel.BannedUsers.filter((member) => member.id !== userId);
      conv.BannedUsers = conv.BannedUsers.filter((member) => member.id !== userId);
    }
    
    
    await this.conversationRepository.save(conv);
    return this.channelRepository.save(channel);
  }
  // async muteUnmuteFromChannel(id: number, user: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Remove user from channel.members
  //   channel.members = channel.members.filter((member) => member.id !== user.id);

  //   return this.channelRepository.save(channel);
  // }
  // async modUnmodFromChannel(id: number, user: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Remove user from channel.members
  //   channel.members = channel.members.filter((member) => member.id !== user.id);

  //   return this.channelRepository.save(channel);
  // }
  // async makeOwner(id: number, user: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Remove user from channel.members
  //   channel.members = channel.members.filter((member) => member.id !== user.id);

  //   return this.channelRepository.save(channel);
  // }
}
