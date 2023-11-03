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
import { Conversation } from '../conversation/conversation.entity';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn({
    comment: 'Unique identifier for a channel',
  })
  id: number;

  @Column()
  channelName: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column()
  is_private: boolean;

  @ManyToOne(() => Conversation, { nullable: true })
  @JoinColumn({ name: 'conversation_id' })
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

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  password: string;
}
