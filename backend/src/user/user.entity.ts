import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatarUrl: string;

  @Column()
  authenticated: boolean;

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
  stats: object;

  @Column()
  matchHistory: object;

  @Column()
  isBanned: boolean;

  @Column()
  isAdmin: string;
}
