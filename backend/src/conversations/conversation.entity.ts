import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  message: string;

  @Column()
  time: Date;
}

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a conversation',
  })
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ManyToMany(() => User)
  @JoinTable()
  BannedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  MutedUsers: User[];

  @Column()
  is_group: boolean;

  @ManyToMany(() => Chat)
  @JoinTable()
  chats: Chat[];
}
