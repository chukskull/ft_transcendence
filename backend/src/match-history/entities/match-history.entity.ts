import { User } from "src/user/user.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class MatchHistory {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.id)
	player1: User;

	@ManyToOne(() => User, user => user.id)
	player2: User;

	@ManyToOne(() => User, user => user.id)
	winner: User;

	@Column()
	date: Date;
}
