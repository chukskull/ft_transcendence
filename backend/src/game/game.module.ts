import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { JwtService } from '@nestjs/jwt';
import { AchievementService } from 'src/achievement/achievement.service';
import { Achievement } from 'src/achievement/achievement.entity';
import { AchievementModule } from 'src/achievement/achievement.module';
import { NotifGateway } from 'src/notifications.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MatchHistory, Achievement]),
    UserModule,
    AchievementModule,
  ],
  providers: [
    GameGateway,
    GameService,
    MatchHistoryService,
    JwtService,
    AchievementService,
    NotifGateway,
  ],
  exports: [GameService],
})
export class GameModule {}
