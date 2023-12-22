import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from '../user/user.entity';
import { NotifGateway } from 'src/notifications.gateway';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(NotifGateway)
    private notifGateway: NotifGateway,
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find();
  }

  async findAc(id: number): Promise<any> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }
    const users = await this.userRepository.find({
      where: { achievements: achievement },
    });
    return { achievement, users };
  }

  async createAchievement(data: any): Promise<Achievement> {
    const { name, description, icon, addedXp } = data;
    const alreadyExists = await this.achievementRepository.findOne({
      where: { name },
    });
    if (alreadyExists) {
      throw new ConflictException('Achievement with this name already exists');
    }
    const achievement = this.achievementRepository.create({
      name,
      description,
      icon,
      addedXp,
    });
    return this.achievementRepository.save(achievement);
  }

  async updateAchievement(
    id: number,
    data: Partial<any>,
  ): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }
    Object.assign(achievement, data);
    return this.achievementRepository.save(achievement);
  }

  async removeAchievement(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }
    return this.achievementRepository.remove(achievement);
  }
  async calculateAchievement(
    player1: any,
    player2: any,
    matchiHistoId: number,
  ): Promise<void> {
    console.log('give achievement---------- and add LEvelvelrkvoerjv');
  }

  async giveAchievement(userId: number, achievementId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['achievements'],
    });
    const achievement = await this.achievementRepository.findOne({
      where: {
        id: achievementId,
      },
    });
    if (!user || !achievement) {
      throw new NotFoundException('User or Achievement not found');
    }
    user.experience += achievement.addedXp;
    user.achievements.push(achievement);
    const savedUser = await this.userRepository.save(user);
    // this.notifGateway.newAchievement(achievement, user.id); send notification to the front
    return savedUser;
  }
}
