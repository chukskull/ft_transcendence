import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy , Profile } from 'passport-42';
import { AuthService } from './auth.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.INTRA_ID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    console.log(profile);
    // const info = profile._json;
    // const user = this.authService.userValid({
    //     email: info.email,
    //     avatarUrl: info.image.link,
    //     intraLogin: info.login,
    // });
    return profile;
  }
}
