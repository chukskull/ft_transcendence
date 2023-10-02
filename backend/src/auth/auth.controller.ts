import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './guards/fortytwo.guard';
import { Response} from 'express';

  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
    ) { }
    
    @UseGuards(FortyTwoGuard)
    @Get('42login')
    async login42(@Req() req, @Res({ passthrough: true }) res: Response) {
      return await this.authService.login42(req, res)
    }
    
}
