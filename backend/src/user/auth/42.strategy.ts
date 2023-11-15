// oauth2.service.ts
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
// import { firstValueFrom } from 'rxjs';
// import { HttpService } from '@nestjs/axios';
import { VerifyCallback } from 'passport-42';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, '42') {
  constructor(
    // private readonly http: HttpService,
    // private readonly jwtService: JwtService,
  ) {
    super(
      {
        clientID: `u-s4t2af-35e5781340a03b0d3d84474cedb18c70dfbe95dd2a9cf9b4b65e871abfac6b6f`,
        clientsecret: `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`,
        callbackURL: `http://localhost:1337/auth/callback`,
        passReqToCallback: true,
      },
    );

  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: VerifyCallback,
  ): Promise<any> {
    // request.session.accessToken = accessToken;
    // console.log("kkkkkkkkk");
    // console.log('accessToken ', accessToken, 'refreshToken ', refreshToken);

    return cb(null, profile);
    }
}