import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	login: string

	@Column()
	name: string

	@Column()
	avatarUrl: string

	@Column()
	authenticated: boolean

	@Column()
	twoFactorAuthEnabled: boolean

	@Column()
	status: string

	@Column()
	friends: string[]

	@Column()
	stats: object

	@Column()
	matchHistory: object

	@Column()
	isBanned: boolean

	@Column()
	isAdmin: string

	@Column()
	campusId: number
}
