import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match-history.controller';
import { MatchHistoryController } from './match-history.controller';

@Module({
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
})
export class MatchHistoryModule {}
