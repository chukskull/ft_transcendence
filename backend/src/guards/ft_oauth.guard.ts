import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FtOauthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    if (!req.cookies.jwt) {
      return false;
    }

    const decode = await this.authService.verifyToken(req.cookies.jwt);

    if (!decode) return false;
    const user = await this.userService.findOne(decode.email);
    req.user = user;
    return true;
  }
}
