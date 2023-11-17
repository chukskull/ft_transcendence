// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService:JwtService,
    private  readonly userService:UserService,
    ){}

    async generateNewToken(user:User) {
      return (this.jwtService.sign({sub: user.id, username:user.intraLogin}));
    }

    async verifyToken(token: string) {
      try {
        return this.jwtService.verifyAsync(token);
      } catch (e) {
        return null;
      }
    }
 
    async checkUser(userInfo: User) {
      console.log(userInfo.email);
      const user = await this.userService.findOne(userInfo.email);
      if (!user)
        user = await this.userService.createNewUser();
      console.log("CHECK");
      console.log(user);
    }
}