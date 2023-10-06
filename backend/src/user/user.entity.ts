import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn()
	id: number

	@Column()
	login: string

	@Column()
	name: string

	@Column()
	email: string

	@Column()
	avatarUrl: string

	@Column()
	authenticated: boolean

	@Column()
	twoFactorAuthEnabled: boolean

	@Column({ nullable: true })
	twoFactorSecret: string

	@Column()
	status: string

	@Column()
	pendingInvite: boolean

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
}
