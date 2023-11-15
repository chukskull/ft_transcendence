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
@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn()
  id: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intraLogin: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  nickName: string;

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

  @ManyToMany(() => MatchHistory)
  @JoinTable()
  matchHistory: MatchHistory[];

  @Column()
  experience: number;

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];

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
}
