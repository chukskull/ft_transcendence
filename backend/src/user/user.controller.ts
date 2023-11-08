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
  @Post(':userId/fill')
  async fill(@Param('userId') userId: number, @Body() data: fillDto) {
    return this.usersService.fillData(userId, data);
  }

  @UseGuards(verifyUser)
  @Post(':userId/update')
  async update(@Param('userId') userId: number, @Body() data: updateDto) {
    return this.usersService.updateUserInfo(userId, data);
  }

  @UseGuards(verifyUser)
  @Post(':userId/status/:status')
  async setStatus(@Param('userId') userId: number, @Param('status') status: string) {
    return this.usersService.setStatus(userId, status);
  }
}
