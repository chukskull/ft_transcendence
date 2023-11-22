import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '723893977587-p0f8s49oqskb0753kg9gaa6a05hqmh41.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:1337/api/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;

      const user = {
        provider: 'google',
        providerId: id,
        email: emails[0].value,
        name: `${name.givenName} ${name.familyName}`,
        picture: photos[0].value,
      };

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
