import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsString()
	imageUrl: string;

	@IsNotEmpty()
	@IsString()
	gameUrl: string;
}
