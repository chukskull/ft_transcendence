import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Stats {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	total: number

	@Column()
	score: number

	@Column()
	winner: number

	@OneToOne(() => User)
	@JoinColumn()
	user: User
}