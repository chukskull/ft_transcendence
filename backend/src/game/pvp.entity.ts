import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class pvpInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  notifSent: boolean;

  @Column({ default: false })
  accepted: boolean;

  @Column({ default: false })
  declined: boolean;

  @ManyToOne(() => User)
  inviter: User;

  @ManyToOne(() => User)
  friend: User;
}
