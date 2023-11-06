import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../user/user.entity';

class Chat {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a chat',
  })
  @Column()
  sender: User;

  @Column()
  message: string;

  @Column()
  time: Date;
}

@Entity('conversations')
export class Conversations {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a conversation',
  })
  id: number;

  @Column()
  convId: string;

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
