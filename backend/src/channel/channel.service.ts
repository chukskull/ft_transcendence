// app/channel/channel.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dtos/create-channel.dto';
// import { UpdateChannelDto } from './dtos/update-channel.dto';
// import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Conversations } from '../conversations/conversations.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}
  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const { name, is_private, password } = createChannelDto;
    const channel = new Channel();
    channel.name = name;
    if (password) {
      channel.password = password;
      channel.is_protected = true;
    }
    else 
      channel.is_protected = false;
    
    channel.conversation = new Conversations();
    // channel.owner = 
    // channel.members.push();
    return this.channelRepository.save(channel);
  }
  async getChannels(): Promise<Channel[]> {
    // Return all non-private channels
    return this.channelRepository.find();
  }
  // async getChannel(id: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   return channel;
  // }
  // async updateChannel(
  //   id: number,
  //   updateChannelDto: UpdateChannelDto,
  // ): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Update channel properties based on updateChannelDto
  //   if (updateChannelDto.name !== undefined) {
  //     // channel.channel_name = updateChannelDto.channel_name;
  //   }
  //   if (updateChannelDto.members !== undefined) {
  //     channel.members = updateChannelDto.members;
  //   }

  //   return this.channelRepository.save(channel);
  // }

  // async deleteChannel(id: number): Promise<void> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   await this.channelRepository.remove(channel);
  // }

  // async joinChannel(id: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Add user to channel.members
  //   channel.members.push(user);

  //   return this.channelRepository.save(channel);
  // }

  // async leaveChannel(id: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Remove user from channel.members
  //   channel.members = channel.members.filter((member) => member.id !== user.id);

  //   return this.channelRepository.save(channel);
  // }

  // async inviteToChannel(id: number, user: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Add user to channel.members
  //   channel.members.push(user);

  //   return this.channelRepository.save(channel);
  // }

  // async banUnbanFromChannel(id: number, user: number): Promise<Channel> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (!channel) {
  //     throw new NotFoundException('Channel not found');
  //   }

  //   // Remove user from channel.members
  //   channel.members = channel.members.filter((member) => member.id !== user.id);

  //   return this.channelRepository.save(channel);
  // }
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
