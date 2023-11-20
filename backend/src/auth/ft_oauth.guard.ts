import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService:  JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    if (!req.cookies.jwt) {
      return false;
    }
    const decode = await this.authService.verifyToken(req.cookies.jwt);
    if (!decode) return false;
    const user = await this.userService.findOne(decode.email);
    console.log(user.avatarUrl);
    req.user = user;
    return true;
  }
}
