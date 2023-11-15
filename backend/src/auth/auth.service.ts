// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class AuthService extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID:
        'u-s4t2af-35e5781340a03b0d3d84474cedb18c70dfbe95dd2a9cf9b4b65e871abfac6b6f',
      clientSecret:
        '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',
      callbackURL: 'http://localhost:1337/api/auth/42/callback',
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
