import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchHistory } from "src/match-history/entities/match-history.entity";
import { Conversations } from "src/conversations/conversations.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
  username: string
  
  @Column()
  email: string;

	@Column()
	nickName: string

	@Column()
	firstName: string

	@Column()
  lastName: string
  
  @Column()
  authenticated: boolean;

  @Column()
  avatarUrl: string;

  @Column()
  twoFactorAuthEnabled: boolean;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column()
  status: string;

  @Column()
  pendingInvite: boolean;

  @Column()
  stats: string;

  @Column()
  matchHistory: object;

  @Column()
  experience: number;

  @Column()
  level: number;

	@OneToMany(() => MatchHistory, matchHistory => matchHistory.player1)
  playerMatches: Promise<MatchHistory[]>

  @OneToMany(() => MatchHistory, matchHistory => matchHistory.winner)
	wonMatches: Promise<MatchHistory[]>

  @Column()
  wins: number;

  @Column()
  totalGames: number;

  @ManyToMany(() => Conversations)
  @JoinTable()
  conversations: Conversations[];
}
