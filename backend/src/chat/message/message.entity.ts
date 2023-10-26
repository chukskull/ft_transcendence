import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class message {
	@PrimaryGeneratedColumn()
	msgId: number;

	@Column()
	channelId: number;

	@Column()
	senderId: number;

	@Column()
	content: string;

	@Column()
	timestamp: Date;
}