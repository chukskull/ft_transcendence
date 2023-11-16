// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class AuthService extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID:process.env.INTRA_ID,
      clientSecret:process.env.INTRA_SECRET,
      callbackURL:process.env.INTRA_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log(profile);
    return {
      userId: profile.id,
      username: profile.username,
      accessToken,
      refreshToken,
    };
  }
}
