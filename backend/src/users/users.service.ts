import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findOne(id: any): Promise<User> {
    return  this.userRepository.findOne(id)
  } 

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find()
  }
  
  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user)
  }

  async findUserById(id: any): Promise<User> {
    const user = await this.userRepository.findOne(id)
    if (!user)
      throw new NotFoundException('User not found')
    return user
  }

  async updateUser(id: any, user: User): Promise<User> {
    return await this.userRepository.save({ ...user, id: Number(id) })
  }

  async findOrCreate(user: User): Promise<User> {
    const existingUser = await this.findUserById(user.id)
    if (!existingUser)
      return await this.createUser(user)
    return existingUser
  }

  async setOnline(id: any) : Promise<any> {
    return this.userRepository.update(id, { status: 'online' })
  }

  
}
