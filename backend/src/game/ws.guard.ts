import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    if (!client.handshake.headers.cookie)
      throw new UnauthorizedException('No cookie');
    try {
      const decode = await this.jwtService.verify(
        client.handshake.headers.cookie.split('=')[1],
      );
      const user = await this.userService.findOne(decode.email);
      if (!user) throw new UnauthorizedException('Please log in to continue');
      client['user'] = user;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }
}
