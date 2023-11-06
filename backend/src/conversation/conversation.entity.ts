import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a chat',
  })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
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

