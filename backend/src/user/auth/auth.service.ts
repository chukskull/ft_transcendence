import { Body, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './models/register.dto';
import { UserService } from '../user.service';
import { UpdateDto } from './models/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  // async twoFactorAuthSecret(clientID: number) {
  //   const client = await this.userService.findUser(clientID);
  //   const secret = authenticator.generateSecret();
  //   await this.userService.saveTwoFactorSecret(secret, clientID);

  //   return authenticator.keyuri(client.email, 'ft_transcendence', secret); //OtpAuthUrl
  // }

  async twoFactorAuthVerify(code: string, clientID: number) {
    const client = await this.userService.findUser(clientID);

    return authenticator.verify({
      token: code,
      secret: client.twoFactorSecret,
    });
  }

  async clientID(request: Request): Promise<number> {
    const cookie = request.cookies['clientID'];
    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }

  async newUser(@Body() data: RegisterDto) {
    const user = await this.userService.createNewUser(data.intraLogin, data.avatar);
    return user;
  }

  async updateUser(@Body() data: UpdateDto) {
    await this.userService.updateUserInfo(data);
  }

  async setOnline(clientID: number) {
    await this.userService.setOnline(clientID);
  }

  async setOffline(clientID: number) {
    await this.userService.setOffline(clientID);
  }
  
}
