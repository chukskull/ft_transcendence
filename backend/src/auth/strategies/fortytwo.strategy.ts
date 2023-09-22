import { Strategy } from 'passport-42'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private readonly userService: UsersService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any) {
		// const	user = await this.userService.findOrCreate({})
	}
}