import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { generateFromEmail } from 'unique-username-generator';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
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
      const data = profile._json;
      const intrLogin = generateFromEmail(data.email, 3);
      let user = await this.authService.checkUser(null, data.email);
      if (!user)
        user = await this.userService.createNewUser(
          intrLogin,
          data.picture,
          data.email,
          data.given_name,
          data.family_name,
        );
      this.userService.setStatus(user.id, 'online');
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
