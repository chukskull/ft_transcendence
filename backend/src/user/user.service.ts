import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async createNewUser(intraLogin: string, avatarUrl: string, email: string) {
    if (!intraLogin) {
      return null;
    }
    const alreadyExists = await this.userRepository.findOne({
      where: {
        intraLogin: intraLogin,
      },
    });
    if (alreadyExists) {
      return null;
    }
    const user = this.userRepository.create({ intraLogin, avatarUrl });
    user.level = 0;
    user.experience = 0;
    user.wins = 0;
    user.totalGames = 0;
    user.email = email;
    user.firstName = '';
    user.lastName = '';
    user.twoFactorAuthEnabled = false;
    user.twoFactorSecret = '';
    user.friends = [];
    user.blockedUsers = [];
    user.matchHistory = [];
    user.status = 'online';
    user.nickName = intraLogin;
    user.conversations = [];
    return this.userRepository.save(user);
  }

  async all(): Promise<User[]> {
    return this.userRepository.find();
  }


  async userProfile(id: any): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['matchHistory', 'channels', 'achievements', 'friends'],
    });
  }

  async fillData(data: any): Promise<any> {
    const { nickName, firstName, lastName, id } = data;
    console.log(data);
    const alreadyExists = await this.userRepository.findOne({
      where: { id },
    });
    if (!alreadyExists) {
      return { message: 'NickName already exists' };
    } else {
      return this.userRepository.update(id, {
        nickName,
        firstName,
        lastName,
      });
    }
  }

  async findPrivateGame(): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.pendingInvite = true');
    return queryBuilder.getOne();
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

  // return an array of users in descending order of experience use await
  async getLeaderboard(): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.experience', 'DESC');
    return queryBuilder.getMany();
  }

  async addFriend(friendID: number): Promise<any> {
    const friend = await this.userRepository.findOne({
      where: { id: friendID },
    });
    if (!friend) {
      return { message: 'User not found' };
    }
    const myUser = 1;
    const client = await this.userRepository.findOne({
      where: { id: myUser },
      relations: ['friends', 'blockedUsers', 'conversations'],
    });
    if (!client) {
      return { message: 'User not found' };
    }
    const alreadyFriend = client.friends.find(
      (friend) => friend.id === friendID,
    );
    if (alreadyFriend) {
      return { message: 'User already in friends' };
    }
    const blocked = client.blockedUsers.find(
      (blocked) => blocked.id === friendID,
    );
    if (blocked) {
      return { message: 'User is blocked' };
    }
    const conversation = client.conversations.find(
      (conversation) =>
        conversation.is_group === false &&
        conversation.members.find((member) => member.id === friendID),
    );
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
  }

  async blockUser(blockedID: number): Promise<any> {
    const client = await this.userRepository.findOne({
      // where: { id: clientID },
    });
    const blocked = await this.userRepository.findOne({
      where: { id: blockedID },
    });
    if (!client || !blocked) {
      return { message: 'User not found' };
    }
    const alreadyBlocked = client.blockedUsers.find(
      (user) => user.id === blockedID,
    );
    if (alreadyBlocked) {
      return { message: 'User already blocked' };
    }
    const friend = client.friends.find((user) => user.id === blockedID);
    if (friend) {
      client.friends = client.friends.filter((user) => user.id !== blockedID);
    }

    client.blockedUsers.push(blocked);
    return this.userRepository.save(client);
  }

  async unblockUser(blockedID: number): Promise<any> {
    const client = await this.userRepository.findOne({
      where: { id: 1 },
    });
    const blocked = await this.userRepository.findOne({
      where: { id: blockedID },
    });
    if (!client || !blocked) {
      return { message: 'User not found' };
    }
    client.blockedUsers = client.blockedUsers.filter(
      (user) => user.id !== blockedID,
    );

    return this.userRepository.save(client);
  }

  async saveTwoFactorSecret(secret: string, clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { twoFactorSecret: secret });
  }

  async enableTwoFactor(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { twoFactorAuthEnabled: true });
  }

  async disableTwoFactor(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, {
      twoFactorAuthEnabled: false,
    });
  }
}
