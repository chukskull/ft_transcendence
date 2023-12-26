import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';
import { User } from '../user/user.entity';
import { NotifGateway } from '../notifications.gateway';
import { MatchHistoryModule } from 'src/match-history/match-history.module';;
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement,MatchHistory,User]), MatchHistoryModule, UserModule],
  controllers: [AchievementController],
  providers: [AchievementService, NotifGateway, MatchHistoryService],
  exports: [AchievementService],
})
export class AchievementModule {}
