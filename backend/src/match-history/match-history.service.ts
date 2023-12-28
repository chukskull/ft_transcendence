import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { MatchHistory } from './match-history.entity';
import { UserService } from 'src/user/user.service';
import { MatchHistoryDto } from './dto/match-history.dto'
import { User } from 'src/user/user.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepo: Repository<MatchHistory>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
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
    console.log(mh.player1);
    console.log(mh.player2);
    mh.date = new Date();
    await this.matchHistoryRepo.save(mh);
    mh.player1.matchHistory.push(mh);
    mh.player2.matchHistory.push(mh);
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

  async addMatchToUserMatchHistory(player1id: number, player2id: number, matchData: MatchHistory) {
    const user1 = await this.userRepo.findOne({
      where: {
        id: player1id
      },
      relations : ['matchHistory']
    })

    if (!user1) throw new NotFoundException('User not found')

    const user2 = await this.userRepo.findOne({
      where: {
        id: player2id
      },
      relations : ['matchHistory']
    })
    if (!user2) throw new NotFoundException('User not found')
    user1.matchHistory.push(matchData)
    user2.matchHistory.push(matchData);

    this.userRepo.save(user1);
    this.userRepo.save(user2);
  }
}
