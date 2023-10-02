import { Req, Res, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'
import { UsersService } from 'src/users/users.service'
import { Response } from 'express'
import { User } from 'src/auth/entities/user.entity'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
	) { }
	
	async login42(@Req() req, @Res({ passthrough: true }) res: Response) {
		if (!req.user)
			return res.status(401).send('Unauthorized')
		await res.cookie('clientID', req.user, { httpOnly: true })
		const client = await this.jwtService.verifyAsync(req.user)
		const userData = await this.usersService.findOne(client['id'])

		if (!userData)
			return res.redirect('http://localhost:3000/register')
		else
			await this.usersService.setOnline(client['id'])
		if (!userData.authenticated == true)
			return res.redirect('http://localhost:3000/twoFactor')
		else
			return res.redirect('http://localhost:3000/profile')
	}
}

