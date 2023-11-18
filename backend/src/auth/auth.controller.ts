import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response , Request} from 'express';
import { FtOauthGuard } from 'src/guards/ft_oauth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  login42(): void {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const token = await this.authService.generateNewToken(req.user);
    console.log('controller');
    console.log(req.user.email);
    res.cookie('jwt', token);
    res.redirect(process.env.frontendUrl + 'home');
  }

  @Get('/42/logout')
  @UseGuards(FtOauthGuard)
  async logout42(@Res() res: Response, @Req() req) {
    console.log(req.user);
    await this.userService.setStatus(req.user.id, 'offline');
    res.cookie('jwt', '');
    req.logout();

    res.redirect(process.env.frontendUrl);
  }
}
