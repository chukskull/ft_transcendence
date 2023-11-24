import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtGuard } from 'src/auth/Jwt.guard';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';
import { AuthService } from 'src/auth/auth.service';

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
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  // @Post('create')
  // async create(@Body() data): Promise<User> {
  //   return this.usersService.createNewUser(
  //     data.intraLogin,
  //     data.avatarUrl,
  //     data.email,
  //   );
  // }
  @Get()
  @UseGuards(JwtGuard)
  async all(): Promise<User[]> {
    return this.usersService.all();
  }

  @Get('profile/:userId')
  @UseGuards(JwtGuard)
  async findUser(@Param('userId') userId: any, @Req() req: any): Promise<User> {
    if (userId == 'me') userId = req.user.nickname;
    return this.usersService.userProfile(userId);
  }

  @Get('/friends')
  @UseGuards(JwtGuard)
  async getFriends(@Req() req: any) {
    return this.usersService.getFriends(req.user.id);
  }
  @Get('/friends/:friendId/chat')
  @UseGuards(JwtGuard)
  async getChat(@Req() req: any, @Param('friendId') friendId: number) {
    return this.usersService.getChatWithFriend(1, friendId);
  }
  @Post('/fill')
  @UseGuards(JwtGuard)
  async fill(@Body() data: fillDto, @Req() req: any) {
    console.log('this is fill ', req.user.id);
    return this.usersService.fillData(data, req.user.id);
  }

  @Post('/update')
  @UseGuards(JwtGuard)
  async update(@Body() data: updateDto) {
    return this.usersService.updateUserInfo(data);
  }

  @Post('/status')
  @UseGuards(JwtGuard)
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @Get('/leaderboard')
  @UseGuards(JwtGuard)
  async getLeaderboard(@Req() req: any) {
    console.log(req.user);
    return this.usersService.getLeaderboard();
  }

  @Post('/sendFriendRequest/:friendId')
  @UseGuards(JwtGuard)
  async sendFriendRequest(@Param('friendId') id: number, @Req() req: any) {
    return this.usersService.sendFriendRequest(req.user.id, id);
  }

  async addFriend(@Param('friendId') id: number, @Req() req: any) {
    const myId = req.user.id;
    return this.usersService.sendFriendRequest(myId, id);
  }

  @Get('/myFriendRequests')
  @UseGuards(JwtGuard)
  async myFriendRequests(@Req() req: any) {
    return this.usersService.getMyPendingFriendRequests(req.user.id);
  }
  @Post('/FriendRequest/:friendId/:action')
  @UseGuards(JwtGuard)
  async FriendRequest(
    @Param('friendId') id: number,
    @Param('action') action: number,
    @Req() req: any,
  ) {
    return this.usersService.handleFriendRequest(id, action, req.user.id);
  }

  @Post('/handleBlock/:friendId/:action')
  @UseGuards(JwtGuard)
  async blockFriend(
    @Param('friendId') frId: number,
    @Req() req: any,
    @Param('action') action: number,
  ) {
    return this.usersService.handleBlock(frId, req.user.id, action);
  }
}
