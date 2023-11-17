import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find();
  }

  async findAc(id: number): Promise<any> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      return null;
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
      return null;
    } else {
      const achievement = this.achievementRepository.create({
        name,
        description,
        icon,
        addedXp,
      });
      return this.achievementRepository.save(achievement);
    }
  }

  async updateAchievement(id: number, data: any): Promise<Achievement> {
    const { name, description, icon, addedXp } = data;
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      return null;
    }
    achievement.name = name || achievement.name;
    achievement.description = description || achievement.description;
    achievement.icon = icon || achievement.icon;
    achievement.addedXp = addedXp || achievement.addedXp;
    return this.achievementRepository.save(achievement);
  }

  async removeAchievement(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      return null;
    }
    return this.achievementRepository.remove(achievement);
  }

  async giveAchievement(userId: number, achievementId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['achievements'],
    });
    const achievement = await this.achievementRepository.findOne({
      where: { id: achievementId },
    });
    if (!user || !achievement) {
      return null;
    }
    user.experience += achievement.addedXp;
    user.achievements.push(achievement);
    return this.userRepository.save(user);
  }
}
