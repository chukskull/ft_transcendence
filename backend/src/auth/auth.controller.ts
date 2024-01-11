import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/Jwt.guard';
import { TwoFactorGuard } from './TwoFactorGuard.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Length, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

class TwoFactorAuthenticationCodeDto {
  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  pin: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Get('/isAuthed')
  @UseGuards(JwtGuard)
  async isAuthed(@Req() req: any, @Res() res: Response): Promise<any> {
    res.sendStatus(200);
  }

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
    try {
      if (req.user.firstTimeLogiIn || !req.user.filledInfo) {
        res.redirect(process.env.frontendUrl + 'fill');
        await this.userRepository.update(req.user.id, {
          firstTimeLogiIn: false,
          PinValid: false,
        });
      }
      await this.userRepository.update(req.user.id, {
        authenticated: true,
        PinValid: false,
      });
      if (req.user.twoFactorAuthEnabled) {
        res.redirect(process.env.frontendUrl + 'verify');
      } else if (req.user.filledInfo) {
        res.redirect(process.env.frontendUrl + 'home');
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/logout')
  @UseGuards(JwtGuard)
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: any) {
    await this.userRepository.update(req.user.id, { authenticated: false });
    await this.userService.setStatus(req.user.id, 'offline');
    await this.userService.ValidPin(req.user.id, false);
    res.clearCookie('token');
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
    const token = await this.authService.generateNewToken(req.user);
    res.cookie('token', token);
    if (req.user.firstTimeLogiIn || !req.user.filledInfo) {
      res.redirect(process.env.frontendUrl + 'fill');
      await this.userRepository.update(req.user.id, { firstTimeLogiIn: false });
    }
    if (req.user.twoFactorAuthEnabled) {
      res.redirect(process.env.frontendUrl + 'verify');
    } else if (req.user.filledInfo) {
      res.redirect(process.env.frontendUrl + 'home');
    }
    await this.userRepository.update(req.user.id, {
      authenticated: true,
      PinValid: false,
    });
  }

  @Get('2fa/generate')
  @UseGuards(TwoFactorGuard)
  async TwoFactorHandler(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const secret = authenticator.generateSecret();

    const otpUri = authenticator.keyuri(req.user.email, 'google', secret);
    await this.userService.saveTwoFactorSecret(secret, req.user.id);

    return toDataURL(otpUri);
  }

  @Post('/2fa/authenticate')
  @UseGuards(TwoFactorGuard)
  async authenticate(
    @Req() req,
    @Body() { pin }: TwoFactorAuthenticationCodeDto,
    @Res() res,
  ) {
    const validCode = await this.authService.isTwoFactorAuthenticationCodeValid(
      pin,
      req.user,
    );
    if (!validCode) throw new UnauthorizedException('Wrong Code');
    await this.userService.ValidPin(req.user.id, true);
    res.sendStatus(HttpStatus.OK);
  }

  @Post('/2fa/turn-on')
  @UseGuards(TwoFactorGuard)
  async turnOn2fa(
    @Req() req: any,
    @Body() { pin }: TwoFactorAuthenticationCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const validCode = await this.authService.isTwoFactorAuthenticationCodeValid(
      pin,
      req.user,
    );
    if (!validCode) throw new UnauthorizedException('Wrong Code');
    await this.userService.enableTwoFactor(req.user.id);
    await this.userService.ValidPin(req.user.id, true);

    res.sendStatus(HttpStatus.OK);
  }

  @Get('2fa/turn-off')
  @UseGuards(TwoFactorGuard)
  async turnOffTwofactor(@Req() req) {
    await this.userService.disableTwoFactor(req.user.id);
    await this.userService.ValidPin(req.user.id, false);
    return '2FA Off';
  }
}
