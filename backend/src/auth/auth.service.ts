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
      console.log("HERE");
      console.log(user.id);
      return (this.jwtService.sign({email: user.email, username:user.intraLogin}));
    }

    async verifyToken(token: string) {
      try {
        return this.jwtService.verifyAsync(token);
      } catch (e) {
        return null;
      }
    }
 
    async checkUser(username: string, email: string) {
      const user = await this.userService.findOne(email);
      if (!user)
      {
        console.log("fff");
        return null;
      }
      return user;
    }
}