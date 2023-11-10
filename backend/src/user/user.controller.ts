import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
// import { AuthService } from './auth/auth.service';
import { verifyUser } from './auth/strategies/auth.guard';
import { User } from './user.entity';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

class fillDto {
  @IsString()
  @IsNotEmpty()
  nickName: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

class updateDto {
  @IsString()
  @IsOptional()
  nickName: string;

  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsNotEmpty()
  @IsBoolean()
  twoFa: Boolean;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService, // private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Body() data): Promise<User> {
    return this.usersService.createNewUser(data.intraLogin, data.avatarUrl);
  }

  @UseGuards(verifyUser)
  @Get()
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @UseGuards(verifyUser)
  @Post('/find/:id')
  async findUser(@Param('id') id: any): Promise<User> {
    return this.usersService.findUser(id);
  }

  @UseGuards(verifyUser)
  @Post('/fill/:userId')
  async fill(@Param('userId') userId: number, @Body() data: fillDto) {
    return this.usersService.fillData(userId, data);
  }

  @UseGuards(verifyUser)
  @Post('/update/:userId')
  async update(@Param('userId') userId: number, @Body() data: updateDto) {
    return this.usersService.updateUserInfo(userId, data);
  }

  @UseGuards(verifyUser)
  @Post(':userId/status/:status')
  async setStatus(
    @Param('userId') userId: number,
    @Param('status') status: string,
  ) {
    return this.usersService.setStatus(userId, status);
  }

  @UseGuards(verifyUser)
  @Get('/leaderboard')
  async getLeaderboard(): Promise<User[]> {
    return this.usersService.getLeaderboard();
  }

  @UseGuards(verifyUser)
  @Post('/addFriend/:ufriendId')
  async addFriend(@Param('userId') userId: number) {
    return this.usersService.addFriend(userId);
  }

  @UseGuards(verifyUser)
  @Post('/blockFriend/:ufriendId')
  async blockFriend(@Param('userId') userId: number) {
    return this.usersService.blockUser(userId);
  }
}
