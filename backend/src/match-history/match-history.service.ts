import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from './match-history.entity';
import { UserService } from 'src/user/user.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { match } from 'assert';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistory: Repository<MatchHistory>,
    private userService: UserService,
  ) {}

  /**
   * Creates a new match history entry in the database.
   * @param createMatchHistoryDto - The DTO containing the necessary data to create a new match history entry.
   */
  async create(MatchHistoryDto: CreateMatchHistoryDto) {
    const mh = new MatchHistory();

    mh.player1 = await this.userService.userProfile(MatchHistoryDto.player1ID);

    mh.player2 = await this.userService.userProfile(MatchHistoryDto.player2ID);

    mh.winner = await this.userService.userProfile(MatchHistoryDto.winnerID);

    mh.date = new Date();

    mh.player1Score = Number(MatchHistoryDto.player1score);

    mh.player2Score = Number(MatchHistoryDto.player2score);

    await this.matchHistory.save(mh);

    return mh;
  }

  /*
   * Returns all match history entries from the database.
   */

  async findAll(): Promise<MatchHistory[]> {
    return this.matchHistory.find();
  }
}
