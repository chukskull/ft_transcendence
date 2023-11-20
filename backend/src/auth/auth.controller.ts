import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtGuard } from 'src/auth/ft_oauth.guard';
import { UserService } from 'src/user/user.service';
import { GoogleGuard  } from './google.guard';
import { GoogleStrategy } from './google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
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
    res.cookie('jwt', token);
    res.redirect(process.env.frontendUrl + 'home');
  }

  @Get('/42/logout')
  @UseGuards(JwtGuard)
  async logout42(@Res() res: Response, @Req() req) {
    await this.userService.setStatus(req.user.id, 'offline');
    res.cookie('jwt', '');
    res.redirect(process.env.frontendUrl);
  }

  @Get('/google')
  @UseGuards(GoogleGuard)
  AuthGoogle(): void {}

  @Get('/google/callback')
  @UseGuards(GoogleGuard)
  async callbackGoogle(
    @Req() req: any,
    @Res({ passthrough: true}) res: Response,
  ) {
    console.log(req.user);
    const token = await this.authService.generateNewToken(req.user);
    res.redirect(process.env.frontendUrl);
  }

  @Get('google/logout')
  @UseGuards(JwtGuard)
  async logoutGoogle(
    @Res() res: Response,
    @Req() req,
  ) {
    await this.userService.setStatus(req.user.id, 'offline');
    res.cookie('jwt', '');
    res.redirect(process.env.frontendUrl);
  }
}
