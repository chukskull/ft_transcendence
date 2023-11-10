import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGameDto {
	@IsOptional()
	@IsNotEmpty()
	winner: string;

	@IsOptional()
	@IsNotEmpty()
	loser: string;

	@IsOptional()
	@IsNotEmpty()
	score: string;
}
