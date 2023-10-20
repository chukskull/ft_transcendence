import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelUser } from './channelUsers.entity';

@Controller('channel')
export class ChannelController {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(ChannelUser)
		private readonly channelUsersRepository: Repository<ChannelUser>,
	) {}

	@Get()
	async findAll(): Promise<Channel[]> {
		return await this.channelRepository.find();
	}

	@Get(':id')
	async findOne(@Param('id') id: any): Promise<Channel> {
		return await this.channelRepository.findOne(id);
	}

	@Post()
	async create(@Body() channel: Channel): Promise<Channel> {
		return await this.channelRepository.save(channel);
	}

	@Post(':id/users')
	async addUserToChannel(
		@Param('id') id: number,
		@Body() channelUser: ChannelUser,
	): Promise<ChannelUser> {
		channelUser.id = id;
		return await this.channelUsersRepository.save(channelUser);
	}
}
