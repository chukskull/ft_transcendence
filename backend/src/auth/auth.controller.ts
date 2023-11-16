// auth.controller.ts
import { Controller, Get, Req, Res, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtOauthGuard } from 'src/guards/ft_oauth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    ) {}

  @Get('/42')
  @UseGuards(FtOauthGuard)
  async login42(): Promise<any> {}

  @Get('/42/callback')
  @UseGuards(FtOauthGuard)
  async callback42(@Req() req, @Res() res): Promise<any> {
    console.log(process.env.INTRA_ID);
    // const token = this.authService.generateNewToken(req.user);
    console.log("HEEEREEE");
    // console.log(token);
    // res.cookie('jwt', token);
    // console.log(req.user['activated']);

  }
}
