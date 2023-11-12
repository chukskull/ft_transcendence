import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createNewUser(intraLogin: string, avatarUrl: string): Promise<User> {
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
    user.firstName = '';
    user.lastName = '';
    user.twoFactorAuthEnabled = false;
    user.twoFactorSecret = '';
    user.friends = [];
    user.blockedUsers = [];
    user.matchHistory = [];
    user.pendingInvite = false;
    user.status = 'online';

    user.nickName = intraLogin;
    return this.userRepository.save(user);
  }

  async all(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUser(id: any): Promise<User> {
    if (typeof id === 'number') {
      return this.userRepository.findOne({ where: { id } });
    } else {
      return this.userRepository.findOne({ where: { nickName: id } });
    }
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
    // const friends
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
    // client.blocked.push(blocked);
    return this.userRepository.save(client);
  }

  async saveTwoFactorSecret(secret: string, clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { twoFactorSecret: secret });
  }

  async setOnline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'ONLINE' });
  }

  async setOffline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'OFFLINE' });
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
