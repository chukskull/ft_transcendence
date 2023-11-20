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
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';
// import { FtOauthGuard } from 'src/guards/ft_oauth.guard';

class fillDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  nickName: string;
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  lastName: string;
}

class updateDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  @Length(3, 15)
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
  // @UseGuards(FtOauthGuard)
  async findUser(@Param('userId') userId: any, @Req() req: any): Promise<User> {
    console.log(req.user);
    return this.usersService.userProfile(userId);
  }

  // @UseGuards(FtOauthGuard)
  @Get('/friends')
  async getFriends(): Promise<User[]> {
    return this.usersService.getFriends();
  }
  // @UseGuards(FtOauthGuard)
  @Post('/fill')
  async fill(@Body() data: fillDto) {
    return this.usersService.fillData(data);
  }

  // @UseGuards(FtOauthGuard)
  @Post('/update')
  async update(@Body() data: updateDto) {
    return this.usersService.updateUserInfo(data);
  }

  @UseGuards()
  // @UseGuards(FtOauthGuard)
  @Post('/status')
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @UseGuards()
  // @UseGuards(FtOauthGuard)
  @Get('/leaderboard')
  async getLeaderboard(@Req() req: any) {
    console.log(req.user);
    return this.usersService.getLeaderboard();
  }

  // @UseGuards(FtOauthGuard)
  @Post('/sendFriendRequest/:friendId')
  async addFriend(@Param('friendId') id: number, @Req() req: any) {
    const myId = req.user.id;
    return this.usersService.sendFriendRequest(myId, id);
  }

  // @UseGuards(FtOauthGuard)
  @Post('/FriendRequest/:friendId/:action')
  async acceptFriendRequest(
    @Param('friendId') id: number,
    @Param('action') action: number,
    @Req() req: any,
  ) {
    return this.usersService.handleFriendRequest(id, action, req.user.id);
  }

  // @UseGuards(FtOauthGuard)
  @Post('/blockFriend')
  async blockFriend(@Body('id') id: number) {
    return this.usersService.blockUser(id);
  }
}
