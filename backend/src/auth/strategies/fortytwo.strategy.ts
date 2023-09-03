import { Strategy } from 'passport-42'
import { PassportModule, PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any) {
		return profile;
	}
}