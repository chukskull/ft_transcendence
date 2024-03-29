import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { ChannelService } from '../channel/channel.service';
import { authenticator } from 'otplib';
import { ConversationService } from 'src/conversations/conversation.service';
import { AuthService } from 'src/auth/auth.service';
import { Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private channelService: ChannelService,
    private conversationService: ConversationService,
  ) {}

  async createNewUser(
    intraLogin: string,
    avatarUrl: string,
    email: string,
    fN: string,
    lN: string,
  ): Promise<User> {
    let alreadyExists;
    try {
      if (!intraLogin) {
        alreadyExists = await this.userRepository.findOne({
          where: {
            intraLogin: intraLogin,
          },
        });
      } else {
        alreadyExists = await this.userRepository.findOne({
          where: {
            email: email,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
    if (alreadyExists) {
      return null;
    }
    const user = this.userRepository.create({ intraLogin, email, avatarUrl });
    user.nickName = intraLogin ? intraLogin : email.split('@')[0];
    user.firstName = fN;
    user.lastName = lN;
    user.firstTimeLogiIn = true;

    // check if the global channel exists
    const savedUser = await this.userRepository.save(user);
    let globalChannel;
    globalChannel = await this.channelRepository.findOne({
      where: {
        name: 'Welcome/Global channel',
      },
    });
    if (!globalChannel) {
      globalChannel = await this.channelService.createChannel(
        {
          name: 'Welcome/Global channel',
          is_private: false,
          password: '',
        },
        savedUser.id,
      );
    } else {
      this.channelService.joinChannel(globalChannel.id, '', savedUser.id);
    }

    this.channelRepository.save(globalChannel);
    return this.userRepository.save(savedUser);
  }
  async validate42Callback(code: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        intraLogin: code,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async all(): Promise<User[]> {
    const allUsers = this.userRepository.find();
    const modifiedUsers = allUsers.then((users) => {
      return users.map((user) => {
        user.twoFactorSecret = '';
        return user;
      });
    });
    return modifiedUsers;
  }

  async userProfile(id: string | number): Promise<User> {
    const user =
      typeof id === 'string'
        ? await this.userRepository.findOne({
            where: { nickName: id },
            relations: [
              'matchHistory',
              'channels',
              'conversations',
              'friends',
              'matchHistory.player1',
              'pendingFriendRequests',
              'matchHistory.player2',
              'achievements',
            ],
          })
        : await this.userRepository.findOne({
            where: { id },
            relations: [
              'matchHistory',
              'channels',
              'conversations',
              'pendingFriendRequests',
              'friends',
              'matchHistory.player1',
              'matchHistory.player2',
              'achievements',
            ],
          });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async fillData(data: any, id: number): Promise<any> {
    const { nickName, firstName, lastName, base64Image } = data;
    const nickNameEx = await this.userRepository.findOne({
      where: { nickName },
    });
    if (nickNameEx) throw new NotAcceptableException('NickName already exists');
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user.filledInfo) return { message: 'User already filled info' };
    const updatedUser = this.userRepository.update(id, {
      nickName,
      firstName,
      lastName,
      avatarUrl: base64Image || user.avatarUrl,
      filledInfo: true,
    });

    return updatedUser;
  }

  async getFriends(userId: number): Promise<User> {
    const client = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends', 'blockedUsers', 'pendingFriendRequests'],
    });
    if (!client) {
      return null;
    }
    return client;
  }
  async getChatWithFriend(clientID: number, friendId: string): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
      relations: [
        'conversations',
        'conversations.chats',
        'conversations.members',
        'conversations.chats.sender',
        'conversations.BannedUsers',
      ],
    });

    if (!client) {
      throw new NotFoundException('User not found');
    }

    const conversation = client.conversations.find(
      (conv) =>
        !conv.is_group &&
        conv.members.some((member) => member.nickName == friendId),
    );
    return conversation || null;
  }

  async updateUserInfo(data, userId): Promise<any> {
    const { nickName, avatarUrl, twoFa } = data;
    let updateData = {};
    if (avatarUrl !== 'noChange')
      updateData = { ...updateData, avatarUrl: avatarUrl };

    updateData = { ...updateData, twoFactorAuthEnabled: twoFa };

    if (nickName) {
      const nickNameEx = await this.userRepository.findOne({
        where: { nickName },
      });
      if (nickNameEx) {
        return { message: 'NickName already exists' };
      } else {
        updateData = { ...updateData, nickName };
      }
    }
    if (!twoFa) {
      updateData = {
        ...updateData,
        twoFactorAuthEnabled: twoFa,
        twoFactorSecret: null,
      };
    }
    return this.userRepository.update(userId, updateData);
  }

  async setStatus(clientID: number, status: string): Promise<any> {
    return this.userRepository.update(clientID, { status: status });
  }

  async getLeaderboard(): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.experience', 'DESC');
    return queryBuilder.getMany();
  }

  async sendFriendRequest(myID: number, friendID: number): Promise<any> {
    if (myID == friendID) {
      return { message: 'Cannot send friend request to yourself' };
    }
    const client = await this.userRepository.findOne({
      where: { id: myID },
      relations: ['friends', 'blockedUsers', 'pendingFriendRequests'],
    });

    const friend = await this.userRepository.findOne({
      where: { id: friendID },
      relations: ['friends', 'blockedUsers', 'pendingFriendRequests'],
    });

    if (!client || !friend) {
      throw new NotFoundException('User not found.');
    }

    if (this.isAlreadyFriend(client, friend))
      return { message: 'User already in friends' };

    if (this.isBlocked(client, friend)) return { message: 'User is blocked' };

    if (this.isBlocked(friend, client))
      return { message: 'You are blocked by this user' };

    if (this.isAlreadyPending(client, friend))
      return { message: 'User already in pending' };

    friend.pendingFriendRequests.push(client);

    await this.saveFriendRequests([client, friend]);

    return { message: 'Friend request sent' };
  }

  // New asynchronous method to save changes
  private async saveFriendRequests(users: User[]): Promise<void> {
    for (const user of users) {
      await this.userRepository.save(user);
    }
  }

  async handleFriendRequest(
    friendID: number,
    action: number,
    handlerId: number,
  ): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: handlerId },
      relations: [
        'friends',
        'blockedUsers',
        'pendingFriendRequests',
        'conversations',
        'conversations.members',
      ],
    });

    const friend = await this.userRepository.findOne({
      where: { id: friendID },
      relations: [
        'friends',
        'blockedUsers',
        'pendingFriendRequests',
        'conversations',
        'conversations.members',
      ],
    });

    if (!client || !friend) {
      throw new NotFoundException('User not found.');
    }
    if (!this.isAlreadyPending(friend, client)) {
      return { message: 'User isnt in pending' };
    }
    if (this.isAlreadyFriend(client, friend)) {
      return { message: 'User already in friends' };
    }

    if (this.isBlocked(client, friend)) {
      return { message: 'User is blocked' };
    }

    // remove friend from my pending requests
    client.pendingFriendRequests = client.pendingFriendRequests.filter(
      (user) => user.id != friendID,
    );

    if (action == 1) {
      //accept

      const conversation = client.conversations.find(
        (conv) =>
          conv.is_group === false &&
          conv.members.find((member) => member.id == friendID),
      );

      if (conversation) {
        client.friends.push(friend);
        friend.friends.push(client);
      } else {
        const newconv = await this.conversationService.createConversation(
          client.id,
          friendID,
        );
        client.friends.push(friend);
        friend.friends.push(client);
        client.conversations.push(newconv);
        friend.conversations.push(newconv);
      }
    }

    await this.userRepository.save(client);
    await this.userRepository.save(friend);
    return { message: 'Friend request handeled' };
  }

  async removeFriend(friendID: number, handlerId: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: handlerId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { id: friendID },
      relations: ['friends'],
    });
    if (!client || !friend) throw new NotFoundException('User not found.');
    const alreadyFriend = this.isAlreadyFriend(client, friend);
    if (!alreadyFriend) return { message: 'User not in friends' };
    client.friends = client.friends.filter((user) => user.id != friendID);
    friend.friends = friend.friends.filter((user) => user.id != handlerId);
    await this.userRepository.save(client);
    await this.userRepository.save(friend);
    return { message: 'Friend removed' };
  }

  private isAlreadyFriend(client: User, friend: User): boolean {
    return client.friends.some((f) => f.id == friend.id);
  }

  private isBlocked(client: User, friend: User): boolean {
    return client.blockedUsers.some((b) => b.id == friend.id);
  }

  private isAlreadyPending(client: User, friend: User): boolean {
    return friend.pendingFriendRequests.some((p) => p.id == client.id);
  }

  async handleBlock(blockedID: number, handlerId: number, action: number) {
    if (blockedID == handlerId) return { message: 'Cannot block yourself' };

    const client = await this.userRepository.findOne({
      where: { id: handlerId },
      relations: [
        'friends',
        'blockedUsers',
        'pendingFriendRequests',
        'conversations',
        'conversations.members',
      ],
    });
    const friendUs = await this.userRepository.findOne({
      where: { id: blockedID },
      relations: [
        'friends',
        'blockedUsers',
        'conversations',
        'pendingFriendRequests',
        'conversations.members',
      ],
    });
    if (!client || !friendUs) throw new NotFoundException('User not found.');
    if (action == 1) {
      const alreadyBlocked = this.isAlreadyBlocked(client, friendUs);
      if (alreadyBlocked) return { message: 'User already blocked' };
      client.friends = client.friends.filter((user) => user.id != blockedID);
      friendUs.friends = friendUs.friends.filter(
        (user) => user.id != handlerId,
      );
      const conversation: any = client.conversations.find(
        (conv) =>
          conv.is_group === false &&
          conv.members.find((member) => member.id == blockedID),
      );
      if (conversation) {
        client.conversations = client.conversations.filter(
          (conv) => conv.id != conversation.id,
        );
        friendUs.conversations = friendUs.conversations.filter(
          (conv) => conv.id != conversation.id,
        );
        this.conversationService.deleteConversation(conversation.id);
      }
      client.pendingFriendRequests = client.pendingFriendRequests.filter(
        (user) => user.id != blockedID,
      );
      friendUs.pendingFriendRequests = friendUs.pendingFriendRequests.filter(
        (user) => user.id != handlerId,
      );
      client.blockedUsers.push(friendUs);
    } else if (action == 0) {
      const alreadyBlocked = this.isAlreadyBlocked(client, friendUs);
      if (!alreadyBlocked) return { message: 'User not blocked' };

      client.blockedUsers = client.blockedUsers.filter(
        (user) => user.id != blockedID,
      );
    }
    await this.userRepository.save(client);
    await this.userRepository.save(friendUs);
    return { message: 'User blocked' };
  }
  async getMyChannels(clientID: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: clientID },
      relations: [
        'channels',
        'channels.members',
        'channels.owner',
        'channels.Moderators',
        'channels.BannedUsers',
        'channels.conversation',
        'channels.conversation.MutedUsers',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const channels = user.channels.map((channel) => {
      channel.password = '';
      return channel;
    });
    return channels;
  }

  async enableTwoFactor(clientID: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
    });
    if (!client) {
      throw new NotFoundException('User not found.');
    }

    client.twoFactorAuthEnabled = true;
    return this.userRepository.save(client);
  }

  async ValidPin(clientID: number, status: boolean): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
    });
    if (!client) throw new NotFoundException('User not found.');
    client.PinValid = status;
    return this.userRepository.save(client);
  }

  async disableTwoFactor(clientID: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
    });
    if (!client) {
      throw new NotFoundException('User not found.');
    }

    client.twoFactorAuthEnabled = false;
    return this.userRepository.save(client);
  }

  async saveTwoFactorSecret(secret: string, clientID: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
    });
    if (!client) throw new NotFoundException('User not found.');

    client.twoFactorSecret = secret;
    return this.userRepository.save(client);
  }

  async isTwoFactorCodeValid(TwoFactorCode: string, user: User) {
    return authenticator.verify({
      token: TwoFactorCode,
      secret: user.twoFactorSecret,
    });
  }

  private isAlreadyBlocked(client: User, blocked: User): boolean {
    return client.blockedUsers.some((user) => user.id == blocked.id);
  }

  private findFriend(client: User, friendID: number): User | undefined {
    return client.friends.find((user) => user.id === friendID);
  }

  async getMyMatchHistory(clientID: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: clientID },
      relations: [
        'matchHistory',
        'matchHistory.player1',
        'matchHistory.player2',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.matchHistory;
  }
  async updateExperienceAndLevel(clientID: number, xp: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: clientID },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.experience += xp;
    const level =
      user.level +
      Math.floor(
        user.experience / (1098 * (user.level + 1) + user.level * 100),
      );
    if (level > user.level) user.level = level;
    if (user.level >= 9) {
      user.rank = 'Gold';
    } else if (user.level >= 6) {
      user.rank = 'Silver';
    } else if (user.level >= 3) {
      user.rank = 'Bronze';
    }
    return this.userRepository.save(user);
  }

  async isInGame(clientID: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: clientID },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.status == 'inGame') return true;
    else return false;
  }
}
