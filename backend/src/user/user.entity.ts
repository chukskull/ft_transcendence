import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "src/conversations/conversation.entity";

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

  @Column()
  status: string;

  @Column()
  pendingInvite: boolean;

  @Column()
  stats: string;

  @ManyToMany(() => MatchHistory)
  @JoinTable()
  matchHistory: MatchHistory[];

  @Column()
  experience: number;

  @Column()
  level: number;


  @Column()
  wins: number;

  @Column()
  totalGames: number;

  @ManyToMany(() => Conversation)
  @JoinTable()
  conversations: Conversation[];
}
