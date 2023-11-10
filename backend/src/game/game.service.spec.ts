import { AxiosResponse } from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should create a new game', async () => {
    const response: AxiosResponse = await service.create(null, { id1: 'player1', id2: 'player2' });

    expect(response.status).toBe(201);
    expect(response.data.gameId).toBeDefined();
  });
});