import { AxiosResponse } from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should create a new game', async () => {
    const response: AxiosResponse = await service.createGame();

    expect(response.status).toBe(201);
    expect(response.data.gameId).toBeDefined();
  });
});