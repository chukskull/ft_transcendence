import { User } from "src/user/user.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class MatchHistory {
	@PrimaryGeneratedColumn()
	id: number;

	// games played as player 1
	@ManyToOne(() => User, user => user.player1Matches)
	player1: User;

	// games played as player 2
	@ManyToOne(() => User, user => user.player2Matches)
	player2: User;


	@ManyToOne(() => User, user => user.id)
	winner: User;

	@Column()
	date: Date;
}
