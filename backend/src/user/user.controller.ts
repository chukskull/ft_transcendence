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
  Length,
} from 'class-validator';
// import { JwtGuard } from 'src/guards/ft_oauth.guard';

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
  async fill(@Body() data: fillDto, @Req() req: any) {
    return this.usersService.fillData(data, req.user.id);
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
  // @UseGuards(FtOauthGuard)
  @Get('/myFriendRequests')
  async myFriendRequests(@Req() req: any) {
    return this.usersService.getMyPendingFriendRequests(req.user.id);
  }
  // @UseGuards(FtOauthGuard)
  @Post('/FriendRequest/:friendId/:action')
  async FriendRequest(
    @Param('friendId') id: number,
    @Param('action') action: number,
    @Req() req: any,
  ) {
    return this.usersService.handleFriendRequest(id, action, req.user.id);
  }

  // @UseGuards(FtOauthGuard)
  @Post('/handleBlock/:friendId/:action')
  async blockFriend(
    @Param('friendId') frId: number,
    @Req() req: any,
    @Param('action') action: number,
  ) {
    return this.usersService.handleBlock(frId, req.user.id, action);
  }
}
