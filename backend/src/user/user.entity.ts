import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from 'src/conversations/conversation.entity';
import { Achievement } from '../achievement/achievement.entity';
import { Channel } from '../channel/channel.entity';
import { MatchHistory } from '../match-history/match-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  nickName: string;

  @Column({ nullable: true })
  authenticated: boolean;

  @Column({ nullable: true })
  intraLogin: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  avatarUrl: string;

  @Column()
  twoFactorAuthEnabled: boolean;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blockedUsers: User[];

  @Column()
  status: string;

  @Column({ nullable: true })
  firstTimeLogiIn: boolean;


  @Column()
  experience: number;

  @ManyToMany(() => User)
  @JoinTable()
  pendingFriendRequests: User[];

  @Column()
  level: number;

  @Column()
  wins: number;

  @Column()
  totalGames: number;

  @ManyToMany(() => Conversation)
  @JoinTable()
  conversations: Conversation[];

  @ManyToMany(() => Achievement)
  @JoinTable()
  achievements: Achievement[];

  @ManyToMany(() => MatchHistory)
  @JoinTable()
  matchHistory: MatchHistory[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];
}
