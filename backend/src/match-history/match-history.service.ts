import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from './entities/match-history.entity';
import { UserService } from 'src/user/user.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
    private userService: UserService,
  ) {
  }

  /**
   * Creates a new match history entry in the database.
   * @param createMatchHistoryDto - The DTO containing the necessary data to create a new match history entry.
   */
  async create(createMatchHistoryDto: CreateMatchHistoryDto) {
    const mh = new MatchHistory();
    mh.player1 = await this.userService.userProfile(createMatchHistoryDto.player1ID);
    mh.player2 = await this.userService.userProfile(createMatchHistoryDto.player2ID);
    mh.winner = await this.userService.userProfile(createMatchHistoryDto.winnerID);
    mh.date = new Date();
    this.matchHistoryRepository.save(mh);
  }

  // TODO: rebuild getMatchHistory

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
      return matchHistory.player1.id === UserID ? {
        id: matchHistory.id,
        player1: {
          id: matchHistory.player1.id,
          nickName: matchHistory.player1.nickName,
        },
        player2: {
          id: matchHistory.player2.id,
          nickName: matchHistory.player2.nickName,
        },
        winner: matchHistory.winner ? {
          id: matchHistory.winner.id,
          nickName: matchHistory.winner.nickName,
        } : null,
        date: matchHistory.date.toDateString()
      } : {
        id: matchHistory.id,
        player1: {
          id: matchHistory.player2.id,
          nickName: matchHistory.player2.nickName,
        },
        player2: {
          id: matchHistory.player1.id,
          nickName: matchHistory.player1.nickName,
        },
        winner: matchHistory.winner ? {
          id: matchHistory.winner.id,
          nickName: matchHistory.winner.nickName,
        } : null,
        date: matchHistory.date.toDateString()
      }
    })
  }

  /**
   * Retrieves the top 10 players based on their win/loss ratio.
   * @returns An array of player objects, with their nickName and win/loss ratio.
   */
  async getLeaderboard() {
    const players = await this.userService.all();
    const leaderboard = players.map((player) => {
      const wonGames = player.wins
      return {
        nickName: player.nickName,
        wins: wonGames,
        losses: player.totalGames -wonGames,
        ratio: wonGames / (player.totalGames - wonGames),
      };
    });
    leaderboard.sort((a, b) => b.wins - a.wins);
    // need to know how many players are in the leaderboard
    return leaderboard.slice(0, 10);
  }
}

