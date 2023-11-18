import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { FtOauthGuard } from 'src/guards/ft_oauth.guard';

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
  @IsNotEmpty()
  @IsNumber()
  id: number;
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
  constructor(private readonly usersService: UserService) {}

  @Post('create')
  async create(@Body() data): Promise<User> {
    return this.usersService.createNewUser(
      data.intraLogin,
      data.avatarUrl,
      data.email,
    );
  }

  @UseGuards()
  @Get()
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Get('profile/:userId')
  async findUser(@Param('userId') userId: any): Promise<User> {
    return this.usersService.userProfile(userId);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Get('/friends')
  async getFriends(): Promise<User[]> {
    return this.usersService.getFriends();
  }
  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/fill')
  async fill(@Body() data: fillDto) {
    return this.usersService.fillData(data);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/update')
  async update(@Body() data: updateDto) {
    return this.usersService.updateUserInfo(data);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/status')
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Get('/leaderboard')
  async getLeaderboard(): Promise<User[]> {
    return this.usersService.getLeaderboard();
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/sendFriendRequest/:friendId')
  async addFriend(@Param('friendId') id: number) {
    return this.usersService.sendFriendRequest(id);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/acceptFriendRequest/:friendId')
  async acceptFriendRequest(@Param('friendId') id: number) {
    return this.usersService.acceptFriendRequest(id);
  }

  @UseGuards()
  @UseGuards(FtOauthGuard)
  @Post('/blockFriend')
  async blockFriend(@Body('id') id: number) {
    return this.usersService.blockUser(id);
  }
}
