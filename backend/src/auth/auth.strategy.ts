// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.INTRA_ID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const userData = profile._json;
    let user = await this.authService.checkUser(userData.login, userData.email);
    if (!user)
      user = await this.userService.createNewUser(
        userData.login,
        userData.image.link,
        userData.email,
      );
    if (user) await this.userService.setStatus(userData.id, 'online');
    return user || null;
  }
}
