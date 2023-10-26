import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { message } from './message.entity';
import { messageDto } from './message.dto';


@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(message)
		private readonly messageRepository: Repository<message>,
	) {}

	async findAllMessages(): Promise<message[]> {
		return await this.messageRepository.find();
	}

	async findChannelMessages(channelId: number): Promise<message[]> {
		const msgs = await this.messageRepository.find({ where: { channelId } });
		return msgs;
	}

	async createMessage(msg: messageDto): Promise<message> {
		return await this.messageRepository.save(msg);
	}
}
