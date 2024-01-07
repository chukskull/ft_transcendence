import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const res: any = context.switchToHttp().getResponse();
    if (!req.cookies.token) throw new UnauthorizedException('wrong code');

    try {
      const decode = await this.authService.verifyToken(req.cookies.token);
      const user = await this.userService.findOne(decode.email);
      if (!user) throw new UnauthorizedException('user not found');

      req.user = user;
    } catch {
      throw new UnauthorizedException('wrong code');
    }
    return true;
  }
}
