import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async all(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: any): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findPrivateGame(): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.pendingInvite = true');
    return  queryBuilder.getOne();
  }

  async create(data): Promise<User> {
    return this.userRepository.save(data);
  }

  async update(id: number, data): Promise<any> {
    return this.userRepository.update(id, data);
  }

  async saveTwoFactorSecret(secret: string, clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { twoFactorSecret: secret });
  }

  async enableTwoFactor(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { authenticated: true });
  }

  async disableTwoFactor(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { authenticated: false });
  }

  async sendGameInvite(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { pendingInvite: true });
  }

  async setOffline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'OFFLINE' });
  }

  async setOnline(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'ONLINE' });
  }

  async setInGame(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { status: 'IN GAME' });
  }

  async acceptGameInvite(clientID: number): Promise<any> {
    return this.userRepository.update(clientID, { pendingInvite: false });
  }

  async findName(data: any): Promise<User> {
    return await this.userRepository.findOne(data.name);
  }
}
