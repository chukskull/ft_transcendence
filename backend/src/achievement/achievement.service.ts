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
import { MatchHistory } from 'src/match-history/match-history.entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { UserService } from 'src/user/user.service';

export const winXP = 369;
export const loseXP = 121;

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(MatchHistory)
    private matchHistory: Repository<MatchHistory>,
    @Inject(NotifGateway)
    private notifGateway: NotifGateway,
    private matchHistoryService: MatchHistoryService,
    private userService: UserService,
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
    player1id: number,
    player2id: number,
    matchHistoId: number,
  ): Promise<void> {
    const matchH = await this.matchHistoryService.findOne(matchHistoId);
    if (!matchH) throw new NotFoundException('Match history not found');

    await this.userService.setStatus(player1id, 'online');
    await this.userService.setStatus(player2id, 'online');
    if (matchH.winner == player1id) {
      await this.userService.updateExperience(player1id, winXP);
      await this.userService.updateExperience(player2id, loseXP);
      const player1WinsInARow =
        await this.matchHistoryService.trackWinsInARow(player1id);
      if (player1WinsInARow == 3) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '3 in a row' },
        });
        await this.giveAchievement(player1id, achievement.id);
      }
      if (player1WinsInARow == 5) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '5 in a row' },
        });
        await this.giveAchievement(player1id, achievement.id);
      }
      if (player1WinsInARow == 10) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '10 in a row' },
        });
        await this.giveAchievement(player1id, achievement.id);
      }
    } else if (matchH.winner == player2id) {
      await this.userService.updateExperience(player2id, winXP);
      await this.userService.updateExperience(player1id, loseXP);
      const player2WinsInARow =
        await this.matchHistoryService.trackWinsInARow(player2id);
      if (player2WinsInARow == 3) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '3 in a row' },
        });
        await this.giveAchievement(player2id, achievement.id);
      }
      if (player2WinsInARow == 5) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '5 in a row' },
        });
        await this.giveAchievement(player2id, achievement.id);
      }
      if (player2WinsInARow == 10) {
        const achievement = await this.achievementRepository.findOne({
          where: { name: '10 in a row' },
        });
        await this.giveAchievement(player2id, achievement.id);
      }
    }
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
