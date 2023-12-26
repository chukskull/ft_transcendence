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

  @Column({
    type: 'enum',
    enum: ['online', 'offline', 'inGame'],
    default: 'offline',
    nullable: true,
  })
  status: string;

  @Column({ nullable: true })
  firstTimeLogiIn: boolean;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 0 })
  level: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ nullable: true })
  winsInARow: number;

  @Column({ default: 0 })
  totalGames: number;

  @ManyToMany(() => User)
  @JoinTable()
  pendingFriendRequests: User[];

  @ManyToMany(() => Conversation)
  @JoinTable()
  conversations: Conversation[];

  @ManyToMany(() => Achievement)
  @JoinTable()
  achievements: Achievement[];

  @Column({
    type: 'enum',
    enum: ['Iron', 'Bronze', 'Silver', 'Gold'],
    nullable: true,
    default: 'Iron',
  })
  rank: string;

  @ManyToMany(() => MatchHistory)
  @JoinTable()
  matchHistory: MatchHistory[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];
}
