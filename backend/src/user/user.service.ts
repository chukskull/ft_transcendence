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

  async findOne(login: any): Promise<User> {
    return this.userRepository.findOne(login);
  }

  async findPrivateGame(): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.pendingInvite = true');
    return queryBuilder.getOne();
  }

  async update(id: number, data): Promise<any> {
    return this.userRepository.update(id, data);
  }


  async sendGameInvite(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { pendingInvite: true });
  }

  async setStatus(clientID: number, status: string): Promise<any> {
    return this.userRepository.update(clientID, { status: status });
  }

  async acceptGameInvite(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { pendingInvite: false });
  }
}
