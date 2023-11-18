import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match-history.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';
import { User } from 'src/user/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MatchHistory, User])],
	providers: [MatchHistoryService],
	controllers: [MatchHistoryController],
})

export class MatchHistoryModule {}