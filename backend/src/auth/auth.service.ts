// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor (private readonly userservice: UserService, private readonly jwtservice: JwtService) {}


  async userValid(profile: User) {
    const user = await this.userservice.userProfile(profile.id);
    if (!user) {
      console.log("creat USER");
      // console.log(intraLogin);
      // let user = await this.userservice.createNewUser(intraLogin, profile.avatarUrl, profile.email);
    }
  }

  async generateNewToken(user: User)  {
    return this.jwtservice.sign({id: user.id , login: user.intraLogin});
  }
}
