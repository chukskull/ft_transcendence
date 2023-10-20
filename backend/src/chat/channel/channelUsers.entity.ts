import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from '../../user/user.entity';
import { Channel } from './channel.entity';

export enum ChannelUserStatus {
	Member = 0,
	Admin,
	Owner,
	Muted,
	Kicked,
}

@Entity()
export class ChannelUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.channelLinks, { onDelete: 'CASCADE' })

	@JoinColumn({ name: 'userId' })
	user: User;
	
	@ManyToOne(() => Channel, (channel) => channel.userLinks, { onDelete: 'CASCADE' })
		
	@JoinColumn({ name: 'channelId' })
	channel: Channel;
	

	@Column()
	isMuted: boolean;

	@Column()
	isBlocked: boolean;
}
