import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FtOauthGuard implements CanActivate{
  constructor (private readonly authService: AuthService, private readonly userService:UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("kkkk");
    const req: any =  context.switchToHttp().getRequest();
    if (!req.cookies.jwt) {
      return false;
    }

    const decode = await this.authService.verifyToken(req.cookies.jwt);
    if (!decode)
      return false;
    console.log("DECODE");
    console.log(decode);
    const user = this.userService.userProfile(decode.sub);
    req.user = user;
    return user ? true : false;
  }
}