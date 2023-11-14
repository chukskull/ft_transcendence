import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
// import { AuthService } from './auth/auth.service';
// import {  } from './auth/strategies/auth.guard';
import { User } from './user.entity';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';

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
  constructor(
    private readonly usersService: UserService, // private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Body() data): Promise<User> {
    return this.usersService.createNewUser(data.intraLogin, data.avatarUrl);
  }

  @UseGuards()
  @Get()
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @UseGuards()
  @Post('/profile/:userId')
  async findUser(@Param('userId') id: number): Promise<User> {
    return this.usersService.userProfile(id);
  }

  @UseGuards()
  @Post('/fill')
  async fill(@Body() data: fillDto) {
    return this.usersService.fillData(data);
  }

  @UseGuards()
  @Post('/update')
  async update(@Body() data: updateDto) {
    return this.usersService.updateUserInfo(data);
  }

  @UseGuards()
  @Post('/status')
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @UseGuards()
  @Get('/leaderboard')
  async getLeaderboard(): Promise<User[]> {
    return this.usersService.getLeaderboard();
  }

  @UseGuards()
  @Post('/addFriend')
  async addFriend(@Body('id') id: number) {
    return this.usersService.addFriend(id);
  }

  @UseGuards()
  @Post('/blockFriend')
  async blockFriend(@Body('id') id: number) {
    return this.usersService.blockUser(id);
  }
}
