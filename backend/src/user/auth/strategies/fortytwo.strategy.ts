import { Strategy } from 'passport-42'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Res } from '@nestjs/common'
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly http: HttpService,
		private readonly jwtService: JwtService
	) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any) : Promise<any> {
		const data = await firstValueFrom(this.http.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` }
		}))
		if (data.status !== 200)
			throw new Error('Failed to get user data from 42 API');
		return await this.jwtService.signAsync({id: data.data.id, login: data.data.login})
	}
}