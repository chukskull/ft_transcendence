import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';

@Module({
	controllers: [MatchHistoryController],
	providers: [MatchHistoryService], // Added a closing parenthesis here
})

export class MatchHistoryModule {}