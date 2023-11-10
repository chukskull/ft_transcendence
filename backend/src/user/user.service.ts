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

  async create(data): Promise<User> {
    return this.userRepository.save(data);
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
    return this.userRepository.update(clientID, { twoFactorAuthEnabled: false });
  }
}
