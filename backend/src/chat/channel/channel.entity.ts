import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ChannelUser } from "./channelUsers.entity";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.channel)
  userLinks: Promise<ChannelUser[]>;

  @Column()
  isPrivate: boolean;

  
  @Column()
  timestamp: Date
  
  @Column()
  password: string | null;
  
  @Column()
  administrators: number[];
  
  @Column()
  public ownerId: number;

  @Column()
  members: number[];
}
