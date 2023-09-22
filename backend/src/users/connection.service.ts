import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Connection } from './entities/connection.entity'

@Injectable()
export class ConnectionService {
	constructor(
		@InjectRepository(Connection)
		private readonly connectionRepository: Repository<Connection>
	) { }
	async getConnection(
		where: any,
		relations = [] as string[]
	): Promise<Connection> {
		const connection = await this.connectionRepository.findOne({ where, relations })
		if (!connection)
			throw new HttpException('Connection not found', HttpStatus.NOT_FOUND)
		return connection;
	}
}