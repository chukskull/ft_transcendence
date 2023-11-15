import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { FtOauthGuard } from '../guards/ft_oauth.guard';

@Controller('login')
export class AuthController {

    @Get('42')
    // @UseGuards(FtOauthGuard)
    @UseGuards(AuthGuard('42'))
    test() {
        return "llllll"
    }

    @Get('42/return')
    @UseGuards(AuthGuard('42'))
    @Redirect('/')
    ftAuthCallback() {

        return ;
    }
}
