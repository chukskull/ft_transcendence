import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { verifyUser } from './strategies/auth.guard';
import { RegisterDto } from './models/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42(@Req() req, @Res({ passthrough: true }) res: Response) {
    await res.cookie('clientID', req.user, { httpOnly: true });
    const client = await this.jwtService.verifyAsync(req.user);

    const clientData = await this.userService.userProfile(client.id);

    if (!clientData) return res.redirect('http://localhost:3000/register');
    else await this.userService.setOnline(client.id);
    if (clientData.authenticated == true)
      return res.redirect('http://localhost:3000/2fa');
    else return res.redirect('http://localhost:3000/profile');
  }
  @Get('42/callback')
    async handle42Callback(@Req() req: Request, @Res() res: Response) {
      const user = await this.authService.validate42Callback(req.query.code);
      if (user) {
        await this.authService.login(req, user);
        return res.redirect('http://localhost:3000/profile');
      } else {
        return res.redirect('http://localhost:3000/login');
      }
  }
  @UseGuards(verifyUser)
  @Get('2fa/generate')
  async generate2fa(@Req() req, @Res({ passthrough: true }) res: Response) {
    const clientID = await this.authService.clientID(req);
    const otpauth = await this.authService.twoFactorAuthSecret(clientID);
    return res.json({ otpauth });
  }

  @UseGuards(verifyUser)
  @Post('2fa/verify')
  async verify2fa(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('code') code: string,
  ) {
    const clientID = await this.authService.clientID(req);
    const verified = await this.authService.twoFactorAuthVerify(code, clientID);
    if (verified) {
      await this.userService.enableTwoFactor(clientID);
      return res.json({ verified });
    } else throw new UnauthorizedException();
  }

  @UseGuards(verifyUser)
  @Post('2fa/login')
  async login2fa(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('code') code: string,
  ) {
    const clientID = await this.authService.clientID(req);
    const verified = await this.authService.twoFactorAuthVerify(code, clientID);
    if (verified) {
      await this.userService.setOnline(clientID);
      return res.json({ verified });
    } else throw new UnauthorizedException();
  }

  @UseGuards(verifyUser)
  @Post('2fa/disable')
  async disable2fa(@Req() req, @Res({ passthrough: true }) res: Response) {
    const clientID = await this.authService.clientID(req);
    await this.userService.disableTwoFactor(clientID);
    return res.json({ disabled: true });
  }

  @UseGuards(verifyUser)
  @Post('register')
  async register(@Body() data: RegisterDto, @Req() req: Request) {
    const clientID = await this.authService.clientID(req);
    return await this.authService.newUser(data);
  }

  @UseGuards(verifyUser)
  @Put('update')
  async update(@Body() data: RegisterDto) {
    return await this.authService.updateUser(data);
  }

  @UseGuards(verifyUser)
  @Get('userData')
  async userData(@Req() req: Request) {
    return await this.userService.userProfile(await this.authService.clientID(req));
  }

  @UseGuards(verifyUser)
  @Post('publicUserData')
  async publicUserData(@Body() req: Request, @Body() data) {
    return await this.userService.userProfile(data.id);
  }

  @UseGuards(verifyUser)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const clientID = await this.authService.clientID(req);
    await this.userService.setOffline(clientID);
    response.clearCookie('clientID');
    return response.json({ logout: true });
  }
}
