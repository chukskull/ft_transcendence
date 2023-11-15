// auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  async login42(): Promise<any> {}

  @Get('/42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req): Promise<any> {
    console.log(req.user);
    return req.user;
  }
}
