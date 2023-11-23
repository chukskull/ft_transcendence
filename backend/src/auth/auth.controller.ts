import { Controller, Get, HttpStatus, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtGuard } from 'src/auth/Jwt.guard';
import { UserService } from 'src/user/user.service';
import { GoogleGuard  } from './google.guard';
import { GoogleStrategy } from './google.strategy';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Console } from 'console';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
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
    res.cookie('token', token);
    console.log(req.user.firstTimeLogiIn);
    if (req.user.firstTimeLogiIn) {
      return res.redirect(process.env.frontendUrl + 'fill');
    }
    res.redirect(process.env.frontendUrl + 'home');
  }

  @Get('/logout')
  @UseGuards(JwtGuard)
  async logout42(@Res() res: Response, @Req() req) {
    await this.userRepository.update(req.user.id, {firstTimeLogiIn: false});
    await this.userService.setStatus(req.user.id, 'offline');
    res.clearCookie('token');
    res.redirect(process.env.frontendUrl);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  AuthGoogle(): void {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    console.log(req.user);
    const token = await this.authService.generateNewToken(req.user);
    console.log(token);
    res.cookie('token', token);
    if (req.user.firstTimeLogiIn) {
      res.redirect(process.env.frontendUrl + 'fill');
    }
    res.redirect(process.env.frontendUrl);
  }

  // @Get('google/logout')
  // @UseGuards(GoogleGuard)
  // async logoutGoogle(
  //   @Res() res: Response,
  //   @Req() req,
  // ) {
  //   await this.userService.setStatus(req.user.id, 'offline');
  //   console.log("HERE");
  //   res.cookie('googleJwt', '');
  //   res.redirect(process.env.frontendUrl);
  // }
  @Get('verifyUser')
  @UseGuards(JwtGuard)
  async verifyUser(@Req() req: any, @Res() res: Response): Promise<any> {
    res.sendStatus(200);
  }
}
