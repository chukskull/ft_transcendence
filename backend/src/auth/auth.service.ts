import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private UsersService: UsersService
	) { }
	private accessToken: {
		name: string,
		value: string
	}

	async hashPassword(password: string): Promise<string> { 
		const saltRounds = 10
		return await bcrypt.hash(password, saltRounds)
	}

	async	verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(plainTextPassword, hashedPassword)
	}

	
}