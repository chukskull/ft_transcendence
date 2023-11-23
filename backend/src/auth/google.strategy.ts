import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { generateFromEmail } from "unique-username-generator";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        super ({
            clientID: "723893977587-p0f8s49oqskb0753kg9gaa6a05hqmh41.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:1337/api/auth/google/callback",
            scope: ['profile', 'email'],
        })
    }

    async validate (
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) : Promise<any> {
        const {id, name, emails, photos } = profile;
        const data = profile._json;
        
        const nickName = generateFromEmail (
            data.email,
            3,
        );
        let user = await this.authService.checkUser(null, data.email);
        if (!user)
            user = await this.userService.createNewUser(
                nickName,
                data.picture,
                data.email,
        );
        // if (user) await this.userService.setStatusByNick(nickName, 'ONLINE');
        // const userData = {
        //     provider: 'google',
        //     providerId: id,
        //     email: emails[0].value,
        //     name: `${name.givenName} ${name.familyName}`,
        //     picture: photos[0].value,
        // };

        done(null, user);
    }
}
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
