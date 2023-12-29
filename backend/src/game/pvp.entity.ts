import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
@Entity()
export class pvpInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
