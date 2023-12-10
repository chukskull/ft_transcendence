import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {}
//   constructor(
//     private readonly authService: AuthService,
//     private readonly userService: UserService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: any = context.switchToHttp().getRequest();
//     if (!req.cookies.googleJwt) {
//       return false;
//     }
//     const decode = await this.authService.verifyToken(req.cookies.googleJwt);
//     if (!decode) return false;
//     const user = await this.userService.findOne(decode.email);
//     // console.log(user.avatarUrl);
//     req.user = user;
//     return true;
//   }
// }
