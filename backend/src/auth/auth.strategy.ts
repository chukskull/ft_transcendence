// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService:AuthService) {
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
    const userData = profile._json;
    const user = this.authService.checkUser( userData );

    
    return {
      userId: profile.id,
      username: profile.username,
      accessToken,
      refreshToken,
    };
  }
}