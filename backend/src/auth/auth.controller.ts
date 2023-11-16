// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards , Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FtOauthGuard } from 'src/guards/ft_oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/42')
  @UseGuards(FtOauthGuard)
  login42(): void{}

  @Get('/42/callback')
  @UseGuards(FtOauthGuard)
  async callback42(@Req() req: any, @Res({ passthrough: true}) res:Response): Promise<any> {

      const token = await this.authService.generateNewToken(req.user);
      console.log("TOKEN");
      console.log(token);
      res.cookie('jwt', token);
    return req.user;
  }
}