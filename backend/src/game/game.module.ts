import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { GameGateway } from './game.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [GameService, GameGateway],
})
export class GameModule { }