import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from './entities/match-history.entity';
import { UserService } from 'src/user/user.service';
import { Stats } from 'src/game/stats.entity';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
    private userService: UserService,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  /**
   * Creates a new match history entry in the database.
   * @param createMatchHistoryDto - The DTO containing the necessary data to create a new match history entry.
   */
  async create(createMatchHistoryDto: CreateMatchHistoryDto) {
    const mh = new MatchHistory();
    mh.player1 = await this.userService.findOne(
      createMatchHistoryDto.player1ID,
    );
    mh.player2 = await this.userService.findOne(
      createMatchHistoryDto.player2ID,
    );
    mh.winner = await this.userService.findOne(createMatchHistoryDto.winnerID);
    mh.date = new Date();
    this.matchHistoryRepository.save(mh);
  }

  /**
   * Retrieves the match history for a given user.
   * @param UserID - The ID of the user whose match history is being retrieved.
   * @returns An array of match history objects, with player and winner information populated.
   */
  async getMatchHistory(UserID: number) {
    const mh = await this.matchHistoryRepository
      .createQueryBuilder('mh')
      .leftJoinAndSelect('match.player1', 'player1')
      .leftJoinAndSelect('match.player2', 'player2')
      .leftJoinAndSelect('match.winner', 'winner')
      .where('player1.id = :id OR player2.id = :id', { UserID })
      .orderBy('match.date', 'DESC')
      .getMany();
    return mh.map((matchHistory) => {
      return matchHistory.player1.id === UserID
        ? {
            id: matchHistory.id,
            player1: {
              id: matchHistory.player1.id,
              username: matchHistory.player1.username,
              stats: matchHistory.player1.stats,
            },
            player2: {
              id: matchHistory.player2.id,
              username: matchHistory.player2.username,
              stats: matchHistory.player2.stats,
            },
            winner: matchHistory.winner
              ? {
                  id: matchHistory.winner.id,
                  username: matchHistory.winner.username,
                }
              : null,
            date: matchHistory.date.toDateString(),
          }
        : {
            id: matchHistory.id,
            player1: {
              id: matchHistory.player2.id,
              username: matchHistory.player2.username,
              stats: matchHistory.player2.stats,
            },
            player2: {
              id: matchHistory.player1.id,
              username: matchHistory.player1.username,
              stats: matchHistory.player1.stats,
            },
            winner: matchHistory.winner
              ? {
                  id: matchHistory.winner.id,
                  username: matchHistory.winner.username,
                }
              : null,
            date: matchHistory.date.toDateString(),
          };
    });
  }

  /**
   * Retrieves the top 10 players based on their win/loss ratio.
   * @returns An array of player objects, with their username and win/loss ratio.
   */
  async getLeaderboard() {
    const players = await this.userService.all();
    const leaderboard = players.map((player) => {
      const wins = player.stats.filter((stat) => stat.win).length;
      const losses = player.stats.filter((stat) => !stat.win).length;
      const ratio = wins / (losses || 1);
      return {
        username: player.username,
        ratio,
      };
    });
    leaderboard.sort((a, b) => b.ratio - a.ratio);
    return leaderboard.slice(0, 10);
  }
}
