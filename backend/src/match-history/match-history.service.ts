import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from './match-history.entity';
import { UserService } from 'src/user/user.service';
import { MatchHistoryDto } from './dto/match-history.dto'

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepo: Repository<MatchHistory>,
    private userService: UserService,
  ) {}

  /**
   * Creates a new match history entry in the database.
   * @param createMatchHistoryDto - The DTO containing the necessary data to create a new match history entry.
   */
  async create(MatchHistoryDto: MatchHistoryDto): Promise<MatchHistory> {
    let uniqueId = 0;
    let isUnique = false;

    while (!isUnique) {
      uniqueId = Math.floor(Math.random() * 100000);
      const existingMatchHistory = await this.matchHistoryRepo.findOne({ where: { id: uniqueId } });
      isUnique = !existingMatchHistory; // Check if the id is unique
    }

    const mh = this.matchHistoryRepo.create({
      id: uniqueId,
      winner: 0,
      player1Score: 0,
      player2Score: 0,
    });
    mh.player1 = await this.userService.userProfile(MatchHistoryDto.player1ID);
    mh.player2 = await this.userService.userProfile(MatchHistoryDto.player2ID);
    mh.date = new Date();
    await this.matchHistoryRepo.save(mh);

    return mh;
  }

  async update(mh: MatchHistory) {
    await this.matchHistoryRepo.save(mh);
  }

  /*
   * Returns all match history entries from the database.
   */

  async findAll(): Promise<MatchHistory[]> {
    return this.matchHistoryRepo.find();
  }

  async findOne(id: any): Promise<MatchHistory> {
    return this.matchHistoryRepo.findOne({ where: id });
  }

  async trackNumberOfWins(playerID: number): Promise<number> {
    const matchHistory = await this.matchHistoryRepo.find({
      where: { winner: playerID },
    });
    return matchHistory.length;
  }

  async trackWinsInARow(playerID: number): Promise<number> {
    const matchHistory = await this.matchHistoryRepo.find({
      where: { winner: playerID },
      order: { date: 'DESC' },
    });
    let winsInARow = 0;
    let i = 0;
    while (matchHistory[i] && matchHistory[i].winner === playerID) {
      winsInARow++;
      i++;
    }
    return winsInARow;
  }
}
