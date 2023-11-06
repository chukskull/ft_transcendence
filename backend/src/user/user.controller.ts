import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { verifyUser } from './auth/strategies/auth.guard';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(verifyUser)
  @Get()
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @UseGuards(verifyUser)
  @Get(':login')
  async findUser(@Req() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }
}
