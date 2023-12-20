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
  avatarUrl: string;

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

  @Get()
  @UseGuards(JwtGuard)
  async all(): Promise<User[]> {
    return this.usersService.all();
  }
  @Post('/update')
  @UseGuards(JwtGuard)
  async update(@Body() data: updateDto, @Req() req: any) {
    console.log('this is le data', data);
    return this.usersService.updateUserInfo(data, req.user.id);
  }

  @Get('profile/:userId')
  @UseGuards(JwtGuard)
  async findUser(@Param('userId') userId: any, @Req() req: any): Promise<User> {
    if (userId == 'me') userId = req.user.id;
    return this.usersService.userProfile(userId);
  }

  @Get('/mychannels')
  @UseGuards(JwtGuard)
  getMyChannels(@Req() req) {
    return this.usersService.getMyChannels(req.user.id);
  }

  @Post('/fill')
  @UseGuards(JwtGuard)
  async fill(@Body() data: fillDto, @Req() req: any) {
    return this.usersService.fillData(data, req.user.id);
  }

  @Post('/status')
  @UseGuards(JwtGuard)
  async setStatus(@Body('userId') id: number, @Body('status') status: string) {
    return this.usersService.setStatus(id, status);
  }

  @Get('/leaderboard')
  @UseGuards(JwtGuard)
  async getLeaderboard(@Req() req: any) {
    return this.usersService.getLeaderboard();
  }
  @Get('/friends')
  @UseGuards(JwtGuard)
  async getFriends(@Req() req: any) {
    return this.usersService.getFriends(req.user.id);
  }

  @Get('/friends/:friendId/chat')
  @UseGuards(JwtGuard)
  async getChat(@Req() req: any, @Param('friendId') friendId: string) {
    return this.usersService.getChatWithFriend(req.user.id, friendId);
  }

  @Get('/addFriend/:friendId')
  @UseGuards(JwtGuard)
  async sendFriendRequest(@Param('friendId') frid: number, @Req() req: any) {
    return this.usersService.sendFriendRequest(req.user.id, frid);
  }

  @Get('/removeFriend/:friendId')
  @UseGuards(JwtGuard)
  async removeFriend(@Param('friendId') friendId: number, @Req() req: any) {
    return this.usersService.removeFriend(req.user.id, friendId);
  }

  @Get('/FriendRequest/:friendId/:action') // 0 = decline, 1 = accept
  @UseGuards(JwtGuard)
  async FriendRequest(
    @Param('friendId') id: number,
    @Param('action') action: number,
    @Req() req: any,
  ) {
    return this.usersService.handleFriendRequest(id, action, req.user.id);
  }

  @Get('/handleBlock/:friendId/:action')
  @UseGuards(JwtGuard)
  async blockFriend(
    @Param('friendId') frId: number,
    @Req() req: any,
    @Param('action') action: number,
  ) {
    return this.usersService.handleBlock(frId, req.user.id, action);
  }
}
