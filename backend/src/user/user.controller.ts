import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtGuard } from 'src/auth/ft_oauth.guard';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
// import { JwtGuard } from 'src/guards/ft_oauth.guard';

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

  // @Post('create')
  // async create(@Body() data): Promise<User> {
  //   return this.usersService.createNewUser(
  //     data.intraLogin,
  //     data.avatarUrl,
  //     data.email,
  //   );
  // }
  @Get()
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @Get('profile/:userId')
  @UseGuards(JwtGuard)
  async findUser(@Param('userId') userId: any, @Req() req: any): Promise<User> {
    console.log(req.user);
    return this.usersService.userProfile(userId);
  }

  @Get('/friends')
  @UseGuards(JwtGuard)
  async getFriends(): Promise<User[]> {
    return this.usersService.getFriends();
  }
  // @UseGuards(JwtGuard)
  @Post('/fill')
  async fill(@Body() data: fillDto) {
    return this.usersService.fillData(data);
  }

  // @UseGuards(JwtGuard)
  @Post('/update')
  async update(@Body() data: updateDto) {
    return this.usersService.updateUserInfo(data);
  }

  @UseGuards()
  // @UseGuards(JwtGuard)
  @Post('/status')
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @UseGuards()
  // @UseGuards(JwtGuard)
  @Get('/leaderboard')
  async getLeaderboard(@Req() req: any) {
    console.log(req.user);
    return this.usersService.getLeaderboard();
  }

  // @UseGuards(JwtGuard)
  @Post('/sendFriendRequest/:friendId')
  async addFriend(@Param('friendId') id: number, @Req() req: any) {
    const myId = req.user.id;
    return this.usersService.sendFriendRequest(myId, id);
  }

  // @UseGuards(JwtGuard)
  @Post('/acceptFriendRequest/:friendId')
  async acceptFriendRequest(@Param('friendId') id: number) {
    return this.usersService.acceptFriendRequest(id);
  }

  // @UseGuards(JwtGuard)
  @Post('/blockFriend')
  async blockFriend(@Body('id') id: number) {
    return this.usersService.blockUser(id);
  }
}
