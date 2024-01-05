// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async checkUser(intraLogin: string, email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async generateNewToken(user: User) {
    try {
      return this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });
    } catch (err) {
      throw new UnauthorizedException('failed to generate token');
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthCode: string,
    user: User,
  ) {
    try {
      const isValid = authenticator.verify({
        token: twoFactorAuthCode,
        secret: user.twoFactorSecret,
      });
      console.log(isValid);
      return isValid;
    } catch (err) {
      return false;
    }
  }
}
