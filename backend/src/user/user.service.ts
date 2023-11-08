import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

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

  async fillData(userId: number, data): Promise<any> {
    const { nickName, firstName, lastName } = data;

    const alreadyExists = await this.userRepository.findOne({
      where: { nickName },
    });
    if (alreadyExists) {
      return { message: 'NickName already exists' };
    } else {
      return this.userRepository.update(userId, {
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

  async updateUserInfo(id: number, data): Promise<any> {
    const { nickName, profilePicture, twoFa } = data;

    const alreadyExists = await this.userRepository.findOne({
      where: { nickName },
    });
    if (alreadyExists) {
    }
    return this.userRepository.update(id, data);
  }

  async setStatus(clientID: number, status: string): Promise<any> {
    return this.userRepository.update(clientID, { status: status });
  }
}
