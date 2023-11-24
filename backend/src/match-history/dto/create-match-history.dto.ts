import { IsNumber } from "class-validator";

export class CreateMatchHistoryDto {
	@IsNumber()
	player1ID: number;

	@IsNumber()
	player2ID: number;

	@IsNumber()
	winnerID: number;

	@IsNumber()
	player1score: number;

	@IsNumber()
	player2score: number;
}
