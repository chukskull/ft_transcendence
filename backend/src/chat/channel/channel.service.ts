import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
	) {}

	async create(name: string): Promise<Channel> {
		const channel = new Channel();
		channel.name = name;
		return await this.channelRepository.save(channel);
	}

	async findAll(): Promise<Channel[]> {
		return await this.channelRepository.find();
	}

	async findOne(id: any): Promise<Channel | null> {
		return await this.channelRepository.findOne(id);
	}

	async update(id: number, name: string): Promise<void> {
		await this.channelRepository.update(id, { name });
	}

	async remove(id: number): Promise<void> {
		await this.channelRepository.delete(id);
	}
}
