import { IsNumber } from 'class-validator';

export class MatchHistoryDto {
  @IsNumber()
  player1ID: number;

  @IsNumber()
  player2ID: number;

  @IsNumber()
  winsInARow: number;
}
