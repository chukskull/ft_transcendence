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
import { ConversationService } from '../conversations/conversation.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private chanRepository: Repository<Channel>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private conversationService: ConversationService,
  ) {}
  async createChannel(
    createChannelDto: CreateChannelDto,
    creator: number,
  ): Promise<Channel> {
    const { name, is_private, password } = createChannelDto;
    const owner = await this.userRepository.findOne({
      where: { id: creator },
      relations: ['channels', 'conversations'],
    });

    if (!owner)
      throw new NotFoundException(`User with ID ${creator} not found`);

    const newConversation = await this.conversationService.createConversation(
      creator,
      null,
    );
    if (!newConversation)
      throw new NotFoundException('Conversation not created');
    const channelAlreadyExists = await this.chanRepository.findOne({
      where: { name },
    });
    if (channelAlreadyExists)
      throw new NotFoundException('Channel already exists');

    const channel = this.chanRepository.create({
      name,
      is_private,
      password,
      owner,
      members: [owner],
      conversation: newConversation,
    });

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      channel.password = hashedPassword;
      channel.is_protected = true;
    } else {
      channel.is_protected = false;
    }

    const savedChannel = await this.chanRepository.save(channel);
    owner.channels.push(savedChannel);
    owner.conversations.push(newConversation);
    this.userRepository.save(owner);

    return savedChannel;
  }

  async getChannels(): Promise<Channel[]> {
    let channels = await this.chanRepository.find({
      where: { is_private: false },
    });
    channels = channels.map((channel) => {
      channel.password = '';
      return channel;
    });
    return channels;
  }
  async getChannel(id: number, userId: number): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id },
      relations: [
        'members',
        'conversation',
        'BannedUsers',
        'MutedUsers',
        'Moderators',
        'owner',
      ],
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    const isAlreadyMember = channel.members?.some(
      (member) => member.id === userId,
    );
    if (isAlreadyMember) {
      channel.password = undefined;
      return channel;
    } else {
      throw new NotFoundException('User not in channel');
    }
  }
  async getChannelChat(chanId: number, userId: number): Promise<Conversation> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
      relations: [
        'conversation',
        'conversation.chats',
        'conversation.members',
        'conversation.chats.sender',
        'members',
      ],
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const isAlreadyMember = channel.members?.some(
      (member) => member.id === userId,
    );
    if (!isAlreadyMember) throw new NotFoundException('User not in channel');
    return channel.conversation;
  }

  async updateChannel(
    updateChannelDto: UpdateChannelDto,
    updater: number,
  ): Promise<Channel> {
    const { id, is_private, password } = updateChannelDto;
    const channel = await this.chanRepository.findOne({
      where: { id },
      relations: ['Moderators', 'owner'],
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const requestMaker = await this.userRepository.findOne({
      where: { id: updater },
    });
    if (!requestMaker) throw new NotFoundException('User not found');

    const isMod = channel.Moderators.some((member) => member.id === updater);
    const isOwner = channel.owner.id === requestMaker.id;
    if (!isMod && !isOwner)
      throw new NotFoundException('User not mod from channel');

    if (password && password.length > 5) {
      const hashedPassword = await bcrypt.hash(password, 10);
      channel.password = hashedPassword;
      channel.is_protected = true;
      channel.is_private = false;
    } else {
      channel.is_protected = false;
      channel.password = '';
      channel.is_private = is_private;
    }

    return this.chanRepository.save(channel);
  }

  async deleteChannel(id: number, mod: number): Promise<void> {
    const channel = await this.chanRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (channel.name === 'Welcome/Global channel') {
      throw new NotFoundException("You can't delete this channel");
    }
    const requestMaker = await this.userRepository.findOne({
      where: { id: mod },
    });
    if (!requestMaker) {
      throw new NotFoundException('User not found');
    }
    const isOwner = channel.owner.id === requestMaker.id;
    if (!isOwner) {
      throw new NotFoundException('User not owner of the channel');
    }
    await this.chanRepository.remove(channel);
  }

  async joinChannel(
    chanId: number,
    password: string,
    userId: number,
  ): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
      relations: ['members', 'conversation'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['conversations', 'channels'],
    });
    if (!user || !channel) {
      throw new NotFoundException('User/channel not found');
    }
    // Check if the channel is private
    if (channel.is_private) {
      throw new NotFoundException(
        'Channel is private you cant join without invite',
      );
    }

    // Check if the channel is protected and verify the password
    if (channel.is_protected) {
      const passwordMatch = await bcrypt.compare(password, channel.password);
      if (!passwordMatch) {
        throw new NotFoundException('Password is incorrect');
      }
    }

    // Check if the user is already a member of the channel
    const isAlreadyMember = channel.members.some(
      (member) => member.id === userId,
    );
    if (isAlreadyMember) throw new NotFoundException('User already in channel');

    channel.members.push(user);
    user.channels.push(channel);
    this.conversationService.joinConversation(channel.conversation.id, userId);
    this.userRepository.save(user);
    return this.chanRepository.save(channel);
  }

  async leaveChannel(chanId: number, userId: number): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
      relations: ['members', 'conversation'],
    });

    if (!channel) 
      throw new NotFoundException('Channel not found');
    
    if (channel.name === 'Welcome/Global channel') {
      throw new NotFoundException("You can't leave this channel");
    }

    // Check if the user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['conversations', 'channels'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Remove user from the channel's members
    channel.members = channel.members?.filter((member) => member.id !== userId);
    user.channels = user.channels.filter((chan) => chan.id !== channel.id);

    await this.userRepository.save(user);
    return this.chanRepository.save(channel);
  }

  async inviteToChannel(
    chanId: number,
    userId: number,
    inviter: number,
  ) {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
      relations: ['members', 'conversation'],
    });
    if (!channel) throw new NotFoundException('Channel not found');

    const requestMaker = await this.userRepository.findOne({
      where: { id: inviter },
    });
    if (!requestMaker) throw new NotFoundException('User not found');

    const inviterisinChannel = channel.members.some(
      (member) => member.id === inviter,
    );
    if (!inviterisinChannel) throw new NotFoundException('User not in channel');

    const isAlreadyMember = channel.members.some(
      (member) => member?.id === userId,
    );
    if (isAlreadyMember) throw new NotFoundException('User already in channel');

    const friend = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['conversations', 'channels'],
    });
    if (!friend) throw new NotFoundException('User not found');

    channel?.members?.push(friend);
    friend?.channels?.push(channel);
    this.conversationService.joinConversation(channel.conversation.id, userId);
    this.userRepository.save(friend);

    this.chanRepository.save(channel);

  }

  async banUnbanFromChannel(
    chanId: number,
    userId: number,
    action: number,
    mod: number,
  ): Promise<Channel> {
    const channel = await this.chanRepository.findOne({
      where: { id: chanId },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.owner.id === userId)
      throw new NotFoundException('User is owner');
    const requestMaker = await this.userRepository.findOne({
      where: { id: mod },
    });
    if (!requestMaker) throw new NotFoundException('User not found');

    const isMod = channel.Moderators.some(
      (member) => member.id === requestMaker.id,
    );
    if (!isMod) throw new NotFoundException('User not mod from channel');

    const conv = await this.conversationRepository.findOne({
      where: {
        id: channel.conversation.id,
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['conversations', 'channels'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (action == 1) {
      const isAlreadyBanned = channel.BannedUsers.some(
        (member) => member?.id === userId,
      );
      if (isAlreadyBanned)
        throw new NotFoundException('User already banned from channel');
      else {
        channel.BannedUsers?.push(user);
        conv.BannedUsers?.push(user);
        channel.members = channel.members.filter(
          (member) => member?.id !== userId,
        );
        conv.members = conv.members.filter((member) => member?.id !== userId);
        user.channels = user.channels.filter(
          (channel) => channel?.id !== chanId,
        );
        user.conversations = user.conversations.filter(
          (conv) => conv?.id !== channel.conversation.id,
        );
      }
    } else {
      channel.BannedUsers = channel.BannedUsers.filter(
        (member) => member?.id !== userId,
      );
      conv.BannedUsers = conv.BannedUsers.filter(
        (member) => member?.id !== userId,
      );
      user.channels.push(channel);
      user.conversations.push(channel.conversation);
      channel.members.push(user);
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
      const isAlreadyMuted = channel.MutedUsers?.some(
        (member) => member?.id === userId,
      );
      if (isAlreadyMuted) {
        throw new NotFoundException('User already muted from channel');
      } else {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        channel.MutedUsers?.push(user);
        conv.MutedUsers?.push(user);
      }
    } else {
      // Remove user from channel.members list
      channel.MutedUsers = channel?.MutedUsers.filter(
        (member) => member?.id !== userId,
      );
      conv.MutedUsers = conv.MutedUsers?.filter(
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
