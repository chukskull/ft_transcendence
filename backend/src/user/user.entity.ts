import { Match } from "src/match/entities/match.entity";
import { ChannelUser } from "src/chat/channel/channelUsers.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchHistory } from "src/match-history/entities/match-history.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	username: string

	@Column()
	nickName: string

	@Column()
	firstName: string

	@Column()
	lastName: string

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

	@OneToMany(() => ChannelUser, channelUser => channelUser.user)
	channelLinks: Promise<ChannelUser[]>

	@ManyToMany(() => User)
	@JoinTable()
	friends: User[]

	@Column()
	status: string

	@Column()
	pendingInvite: boolean

	@Column()
	stats: object

	@OneToMany(() => MatchHistory, matchHistory => matchHistory.player1)
	player1Matches: Promise<MatchHistory[]>

	@OneToMany(() => MatchHistory, matchHistory => matchHistory.player2)
	player2Matches: Promise<MatchHistory[]>

	@OneToMany(() => MatchHistory, matchHistory => matchHistory.winner)
	winnerMatches: Promise<MatchHistory[]>

	
}
