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
import { Conversation } from '../conversations/conversation.entity';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a channel',
  })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column()
  is_private: boolean;

  @Column()
  is_protected: boolean;

  @ManyToOne(() => Conversation, { nullable: true })
  conversation: Conversation;

  @ManyToMany(() => User)
  @JoinTable()
  BannedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  MutedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  Moderators: User[];

  @ManyToOne(() => User, { nullable: true })
  owner: User;

  @Column({ nullable: true })
  password: string;
}
