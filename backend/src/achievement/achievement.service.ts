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

export const ThreeWinsData = {
  name: '3 wins',
  description: 'Win 3 games',
  icon: 'https://i.imgur.com/YKmHpYD.png',
  addedXp: 300,
};

export const FiveWinsData = {
  name: '5 wins',
  description: 'Win 5 games',
  icon: 'https://i.imgur.com/3788ZGE.png',
  addedXp: 500,
};

export const TenWinsData = {
  name: '10 wins',
  description: 'Win 10 games',
  icon: 'https://i.imgur.com/ZWNSYyK.png',
  addedXp: 900,
};

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
    const matchH = await this.matchHistory.findOne( { where: { id: matchHistoId } });
    if (!matchH) throw new NotFoundException('Match history not found');

    await this.userService.setStatus(player1id, 'online');
    await this.userService.setStatus(player2id, 'online');
    
    await this.userRepository.update({ id: player1id }, {
      totalGames: () => 'totalGames + 1'
    });
    await this.userRepository.update({ id: player2id }, {
      totalGames: () => 'totalGames + 1'
    });
    switch (matchH.winner) {
      case player1id:
        await this.userRepository.update({ id: player1id }, {
          wins: () => 'wins + 1'
        });
        const player1Wins = await this.matchHistory.find({
          where: { winner: player1id },
        });
        switch (player1Wins.length) {
          case 3:
            let threeWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '3 wins' },
            });
            if (!threeWinsAchievement) threeWinsAchievement = await this.createAchievement(ThreeWinsData);
            await this.giveAchievement(player1id, threeWinsAchievement.id);
            break;
          case 5:
            let fiveWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '5 wins' },
            });
            if (!fiveWinsAchievement) fiveWinsAchievement = await this.createAchievement(FiveWinsData);
            await this.giveAchievement(player1id, fiveWinsAchievement.id);
            break;
          case 10:
            let tenWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '10 wins' },
            });
            if (!tenWinsAchievement)
            tenWinsAchievement = await this.createAchievement(TenWinsData);
            await this.giveAchievement(player1id, tenWinsAchievement.id);
            break;
        }
        break;
      case player2id:
        await this.userRepository.update({ id: player2id }, {
          wins: () => 'wins + 1'
        });
        const player2Wins = await this.matchHistory.find({
          where: { winner: player2id },
        });
        switch (player2Wins.length) {
          case 3:
            let threeWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '3 wins' },
            });
            if (!threeWinsAchievement) threeWinsAchievement = await this.createAchievement(ThreeWinsData);
            await this.giveAchievement(player2id, threeWinsAchievement.id);
            break;
          case 5:
            let fiveWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '5 wins' },
            });
            if (!fiveWinsAchievement) fiveWinsAchievement = await this.createAchievement(FiveWinsData);
            await this.giveAchievement(player2id, fiveWinsAchievement.id);
            break;
          case 10:
            let tenWinsAchievement = await this.achievementRepository.findOne({
              where: { name: '10 wins' },
            });
            if (!tenWinsAchievement)
            tenWinsAchievement = await this.createAchievement(TenWinsData);
            await this.giveAchievement(player2id, tenWinsAchievement.id);
            break;
        }
        break;
    }
    await this.userService.updateExperienceAndLevel(matchH.winner, winXP);
    await this.userService.updateExperienceAndLevel(matchH.loser, loseXP);
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
    this.notifGateway.newAchievement(achievement, user.id);
    return await this.userRepository.save(user);
  }
}
