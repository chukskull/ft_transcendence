import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversations } from '../conversations/conversations.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  name: string;

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

  @Column()
  wins: number;

  @Column()
  totalGames: number;

  @ManyToMany(() => Conversations)
  @JoinTable()
  conversations: Conversations[];
}
