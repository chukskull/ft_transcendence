import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() { }
  
  async createUser(user: User): Promise<User> {
    return user
  }

  async findUserById(id: number): Promise<User | undefined> {
    return undefined
  }

  async updateUser(user: User): Promise<User> {
    return user
  }

  async deleteUserById(id: number) { }

  async findOrCreate(user: User): Promise<User> {
    const existingUser = await this.findUserById(user.id)
    if (!existingUser)
      return await this.createUser(user)
    return existingUser
  }
}
