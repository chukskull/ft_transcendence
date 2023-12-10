import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';
import { User } from '../user/user.entity';
import { NotifGateway } from '../notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, User])],
  controllers: [AchievementController],
  providers: [AchievementService, NotifGateway],
  exports: [AchievementService],
})
export class AchievementModule {}
