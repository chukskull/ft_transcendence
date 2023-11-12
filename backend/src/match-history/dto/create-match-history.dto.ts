import { isNumber } from "class-validator";

export class CreateMatchHistoryDto {
	@isNumber()
	player1ID: number;

	@isNumber()
	player2ID: number;

	@isNumber()
	winnerID: number;
}
