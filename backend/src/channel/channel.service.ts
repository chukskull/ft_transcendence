// app/channel/channel.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Conversation } from '../conversations/conversation.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private chanRepository: Repository<Channel>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}
  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const { name, is_private, password } = createChannelDto;
    const channel = new Channel();
    channel.name = name;
    channel.is_private = is_private;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      channel.password = hashedPassword;
      channel.is_protected = true;
    } else {
      channel.is_protected = false;
    }

    channel.conversation = new Conversation();
    console.log(channel);
    return this.chanRepository.save(channel);
  }

  async getChannels(): Promise<Channel[]> {
    // Return all non-private channels
    return this.chanRepository.find();
  }
  async getChannel(id: number): Promise<Channel> {
    const channel = await this.chanRepository.find({ where: { id } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return channel[0];
  }
  async getMyChannels(): Promise<Channel[]> {
    // const userId = requestMaker.id;
    const userId = 14124;
    // Return all channels where user is a member
    return this.chanRepository.find({
      where: { members: { id: userId } },
    });
  }

  async updateChannel(updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const { id, name, is_private, password } = updateChannelDto;

    const channel = await this.chanRepository.findOne({ where: { id } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (password && password.length > 5) {
      channel.password = password;
      channel.is_protected = true;
    } else channel.is_protected = false;

    if (name) {
      channel.name = name;
    }
    channel.is_private = is_private;

    return this.chanRepository.save(channel);
  }

  async deleteChannel(id: number): Promise<void> {
    const channel = await this.chanRepository.findOne({ where: { id } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    await this.chanRepository.remove(channel);
  }

  async joinChannel(chanId: number, password: string): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.is_protected) {
      const passwordMatch = await bcrypt.compare(password, channel.password);
      if (!passwordMatch) {
        throw new NotFoundException('Password is incorrect');
      }
    }

    if (channel.is_private) {
      throw new NotFoundException('Channel is private');
    }

    const userId = 14124;

    // check if user is already in channel members list
    const isAlreadyMember = channel.members.some(
      (member) => member.id === userId,
    );
    if (isAlreadyMember) {
      throw new NotFoundException('User already in channel');
    } else {
      channel.members.push(new User());
    }

    return this.chanRepository.save(channel);
  }

  async leaveChannel(chanId: number): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const userId = 14124;
    // Remove user from channel.members list
    channel.members = channel.members.filter((member) => member.id !== userId);

    return this.chanRepository.save(channel);
  }

  async inviteToChannel(chanId: number, userId: number): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const isAlreadyMember = channel.members.some(
      (member) => member.id === userId,
    );

    if (isAlreadyMember) {
      throw new NotFoundException('User already in channel');
    } else {
      channel.members.push(new User());
    }

    return this.chanRepository.save(channel);
  }

  async banUnbanFromChannel(
    chanId: number,
    userId: number,
    action: number,
  ): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const conv = await this.conversationRepository.findOne({
      where: {
        id: channel.conversation.id,
      },
    });
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
      } else {
        channel.BannedUsers.push(new User());
        conv.BannedUsers.push(new User());
      }
    } else {
      // Remove user from channel.members list
      channel.BannedUsers = channel.BannedUsers.filter(
        (member) => member.id !== userId,
      );
      conv.BannedUsers = conv.BannedUsers.filter(
        (member) => member.id !== userId,
      );
    }

    await this.conversationRepository.save(conv);
    return this.chanRepository.save(channel);
  }

  async muteUnmuteFromChannel(
    chanId: number,
    userId: number,
    action: number,
  ): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const conv = await this.conversationRepository.findOne({
      where: {
        id: channel.conversation.id,
      },
    });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }
    if (action == 1) {
      // check if user is already in channel muted list
      const isAlreadyMuted = channel.MutedUsers.some(
        (member) => member.id === userId,
      );
      if (isAlreadyMuted) {
        throw new NotFoundException('User already muted from channel');
      } else {
        channel.MutedUsers.push(new User());
        conv.MutedUsers.push(new User());
      }
    } else {
      // Remove user from channel.members list
      channel.MutedUsers = channel.MutedUsers.filter(
        (member) => member.id !== userId,
      );
      conv.MutedUsers = conv.MutedUsers.filter(
        (member) => member.id !== userId,
      );
    }

    await this.conversationRepository.save(conv);
    return this.chanRepository.save(channel);
  }

  async modUnmodFromChannel(
    chanId: number,
    userId: number,
    action: number,
  ): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (action == 1) {
      const isAlreadyMod = channel.Moderators.some(
        (member) => member.id === userId,
      );
      if (isAlreadyMod) {
        throw new NotFoundException('User already mod from channel');
      } else {
        channel.Moderators.push(new User());
      }
    } else {
      // Remove user from channel.members list
      channel.Moderators = channel.Moderators.filter(
        (member) => member.id !== userId,
      );
    }
    return this.chanRepository.save(channel);
  }

  async makeOwner(chanId: number, userId: number): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    // if (channel.owner.id === requestMaker.id) {
    //   channel.owner = userId;
    // }
    return this.chanRepository.save(channel);
  }
}
