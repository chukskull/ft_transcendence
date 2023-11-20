import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { MatchHistory } from 'src/match-history/match-history.entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, MatchHistory]),
	UserModule],
	providers: [GameService, GameGateway, MatchHistoryService, JwtService],
})

export class GameModule {}