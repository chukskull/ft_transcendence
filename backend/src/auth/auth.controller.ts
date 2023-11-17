// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards , Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FtOauthGuard } from 'src/guards/ft_oauth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService:UserService) {}

  @Get('/42/login')
  @UseGuards(AuthGuard('42'))
  login42(): void{}

  @Get('/42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req: any, @Res({ passthrough: true}) res:Response): Promise<any> {
      const token = await this.authService.generateNewToken(req.user);
      console.log(req.user);
      res.cookie('jwt', token);
      res.redirect(process.env.frontendUrl + '/home');
  }

  @Get('/42/logout')
  @UseGuards(FtOauthGuard)
  async logout42(@Res() res: Response, @Req() req: any) {
    // const user = this.userService.userProfile(req.user.id);
    await this.userService.setStatus(req.user.id, 'offline');
    res.cookie('jwt', null);
    res.redirect(process.env.frontendUrl + '/home');
  }
}