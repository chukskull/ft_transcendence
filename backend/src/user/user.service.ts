import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Conversation, Chat } from '../conversations/conversation.entity';
import { NotFoundException } from '@nestjs/common';
import { NotifGateway } from 'src/notifications.gateway';
@Injectable()
export class UserService {
  constructor(
    private readonly notifGateway: NotifGateway,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async createNewUser(intraLogin: string, avatarUrl: string, email: string) {
    let alreadyExists;
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
    if (alreadyExists) {
      return null;
    }
    const user = this.userRepository.create({ intraLogin, avatarUrl, email });
    user.level = 0;
    user.experience = 0;
    user.wins = 0;
    user.totalGames = 0;
    user.email = email;
    user.nickName = intraLogin ? intraLogin : email;
    user.firstName = '';
    user.lastName = '';
    user.twoFactorAuthEnabled = false;
    user.twoFactorSecret = '';
    user.friends = [];
    user.blockedUsers = [];
    user.matchHistory = [];
    user.status = 'offline';
    user.nickName = intraLogin;
    user.firstTimeLogiIn = true;
    user.conversations = [];
    return this.userRepository.save(user);
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
    return this.userRepository.find();
  }

  async userProfile(id: string | number): Promise<User> {
    const user =
      typeof id === 'string'
        ? await this.userRepository.findOne({
            where: { nickName: id },
            relations: ['matchHistory', 'channels', 'conversations'],
          })
        : await this.userRepository.findOne({
            where: { id },
            relations: ['matchHistory', 'channels', 'conversations'],
          });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async fillData(data: any, id: number): Promise<any> {
    const { nickName, firstName, lastName } = data;
    console.log(data);
    const alreadyExists = await this.userRepository.findOne({
      where: { id },
    });
    if (!alreadyExists) return { message: 'NickName already exists' };
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user.nickName || user.firstName)
      return { message: 'data already filled' };
    return this.userRepository.update(id, {
      nickName,
      firstName,
      lastName,
    });
  }

  async getFriends(userId: number): Promise<User[]> {
    const client = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    if (!client) {
      return null;
    }
    return client.friends;
  }
  async getChatWithFriend(userId: number, friendId: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'conversations',
        'conversations.chats',
        'conversations.members',
        'conversations.chats.sender',
      ],
    });
    if (!client) {
      return null;
    }
    const conversation = client.conversations.find(
      (conv) => (conv.is_group === false &&
      conv.members.find((member) => member.id == friendId)),
    );

    if (!conversation) {
      return null;
    }
    return conversation;
  }

  async updateUserInfo(data): Promise<any> {
    const { nickName, profilePicture, twoFa, id } = data;

    const alreadyExists = await this.userRepository.findOne({
      where: { id },
    });
    if (alreadyExists) {
      await this.userRepository.update(id, {
        nickName,
        avatarUrl: profilePicture,
        twoFactorAuthEnabled: twoFa,
      });
    }
    return this.userRepository.update(id, data);
  }

  async setStatus(clientID: number, status: string): Promise<any> {
    return this.userRepository.update(clientID, { status: status });
  }

  async setStatusByNick(nickName: string, status: string): Promise<any> {
    return this.userRepository.update(nickName, {status: status});
  }

  async getLeaderboard(): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.experience', 'DESC');
    return queryBuilder.getMany();
  }

  async sendFriendRequest(myID: number, friendID: number): Promise<any> {
    const { client, friend } = await this.getClientAndFriend(friendID);

    if (this.isAlreadyFriend(client, friend)) {
      return { message: 'User already in friends' };
    }

    if (this.isBlocked(client, friend)) {
      return { message: 'User is blocked' };
    }

    if (this.isAlreadyPending(client, friend)) {
      return { message: 'User already in pending' };
    }

    friend.pendingFriendRequests.push(client);
    const SavedFriend = this.userRepository.save(friend);

    this.notifGateway.newFriendRequest(client, friendID);
    return SavedFriend;
  }

  async handleFriendRequest(
    friendID: number,
    action: number,
    handlerId: number,
  ): Promise<any> {
    const { client, friend } = await this.getClientAndFriend(friendID);

    if (this.isAlreadyFriend(client, friend)) {
      return { message: 'User already in friends' };
    }

    if (this.isBlocked(client, friend)) {
      return { message: 'User is blocked' };
    }

    const pending = this.findPendingRequest(client, friendID);
    if (!pending) {
      return { message: 'User is not in pending' };
    }

    if (action === 1) {
      //accept
      client.pendingFriendRequests = client.pendingFriendRequests.filter(
        (pending) => pending.id !== friendID,
      );

      const conversation = this.findConversation(client, friendID);

      if (conversation) {
        client.friends.push(friend);
      } else {
        const newConversation = await this.conversationRepository.create({
          is_group: false,
          members: [client, friend],
          chats: [],
        });

        client.conversations.push(newConversation);
        friend.conversations.push(newConversation);
        client.friends.push(friend);
      }
    } else {
      //decline
      client.pendingFriendRequests = client.pendingFriendRequests.filter(
        (pending) => pending.id !== friendID,
      );
    }

    return this.userRepository.save(client);
  }

  async getMyPendingFriendRequests(clientID: number): Promise<User[]> {
    const client = await this.userRepository.findOne({
      where: { id: clientID },
      relations: ['pendingFriendRequests'],
    });

    if (!client) {
      throw new NotFoundException('User not found.');
    }

    return client.pendingFriendRequests;
  }

  private async getClientAndFriend(
    friendID: number,
  ): Promise<{ client: User; friend: User }> {
    const myUser = 1;
    const [client, friend] = await Promise.all([
      this.userRepository.findOne({
        where: { id: myUser },
        relations: [
          'friends',
          'blockedUsers',
          'conversations',
          'pendingFriendRequests',
        ],
      }),
      this.userRepository.findOne({
        where: { id: friendID },
        relations: ['friends', 'blockedUsers', 'pendingFriendRequests'],
      }),
    ]);

    if (!client || !friend) {
      throw new NotFoundException('User not found.');
    }

    return { client, friend };
  }

  private isAlreadyFriend(client: User, friend: User): boolean {
    return client.friends.some((f) => f.id === friend.id);
  }

  private isBlocked(client: User, friend: User): boolean {
    return client.blockedUsers.some((b) => b.id === friend.id);
  }

  private isAlreadyPending(client: User, friend: User): boolean {
    return friend.pendingFriendRequests.some((p) => p.id === client.id);
  }

  private findPendingRequest(client: User, friendID: number): User | undefined {
    return client.pendingFriendRequests.find((p) => p.id === friendID);
  }

  private findConversation(
    client: User,
    friendID: number,
  ): Conversation | undefined {
    return client.conversations.find(
      (conv) =>
        conv.is_group === false &&
        conv.members.find((member) => member.id === friendID),
    );
  }

  async handleBlock(blockedID: number, handlerId: number, action: number) {
    const { client, blocked } = await this.getClientAndBlockedUser(blockedID);

    // 1 block 0 unblock
    if (action === 1) {
      const alreadyBlocked = this.isAlreadyBlocked(client, blocked);
      if (alreadyBlocked) {
        return { message: 'User already blocked' };
      }

      const friend = this.findFriend(client, blockedID);
      if (friend) {
        client.friends = client.friends.filter((user) => user.id !== blockedID);
      }

      client.blockedUsers.push(blocked);
      return this.userRepository.save(client);
    } else if (action === 0) {
      const alreadyBlocked = this.isAlreadyBlocked(client, blocked);
      if (!alreadyBlocked) {
        return { message: 'User not blocked' };
      }

      client.blockedUsers = client.blockedUsers.filter(
        (user) => user.id !== blockedID,
      );
      return this.userRepository.save(client);
    }
  }

  private async getClientAndBlockedUser(
    blockedID: number,
    clientID?: number,
  ): Promise<{ client: User; blocked: User }> {
    const [client, blocked] = await Promise.all([
      this.userRepository.findOne({
        where: { id: clientID || 1 },
        relations: ['friends', 'blockedUsers'],
      }),
      this.userRepository.findOne({ where: { id: blockedID } }),
    ]);

    if (!client || !blocked) {
      throw new NotFoundException('User not found.');
    }

    return { client, blocked };
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
    if (!client) {
      throw new NotFoundException('User not found.');
    }

    client.twoFactorSecret = secret;
    return this.userRepository.save(client);
  }

  private isAlreadyBlocked(client: User, blocked: User): boolean {
    return client.blockedUsers.some((user) => user.id === blocked.id);
  }

  private findFriend(client: User, friendID: number): User | undefined {
    return client.friends.find((user) => user.id === friendID);
  }

  async setOnline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'online' });
  }

  async setOffline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'offline' });
  }
}
