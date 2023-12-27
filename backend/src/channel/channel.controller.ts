import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Get,
  Put,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { JwtGuard } from 'src/auth/Jwt.guard';
import { UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  create(@Body() createChannelDto: CreateChannelDto, @Req() req) {
    return this.channelService.createChannel(createChannelDto, req.user.id);
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  update(@Body() updateChannelDto: UpdateChannelDto, @Req() req) {
    return this.channelService.updateChannel(updateChannelDto, req.user.id);
  }

  @Get('all')
  @UseGuards(JwtGuard)
  findAll() {
    return this.channelService.getChannels();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number, @Req() req) {
    return this.channelService.getChannel(id, req.user.id);
  }

  @Get(':id/chat')
  @UseGuards(JwtGuard)
  findChat(@Param('id') ChannId: number, @Req() req) {
    return this.channelService.getChannelChat(ChannId, req.user.id);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtGuard)
  delete(@Param('id') id: number, @Req() req) {
    return this.channelService.deleteChannel(id, req.user.id);
  }

  @Post(':chanId/join')
  @UseGuards(JwtGuard)
  join(@Body() data: any, @Req() req, @Param('chanId') chanId: number) {
    const { password } = data;
    return this.channelService.joinChannel(chanId, password, req.user.id);
  }

  @Get(':chanId/leave')
  @UseGuards(JwtGuard)
  leave(@Param('chanId') chanId: number, @Req() req) {
    return this.channelService.leaveChannel(chanId, req.user.id);
  }

  @Get(':chandId/kickUser/:userId')
  @UseGuards(JwtGuard)
  kickuser(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Req() req,
  ) {
    return this.channelService.kickFromChannel(chanId, userId, req.user.id);
  }

  @Get(':chandId/invite/:userId')
  @UseGuards(JwtGuard)
  invite(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Req() req,
  ) {
    return this.channelService.inviteToChannel(chanId, userId, req.user.id);
  }

  @Get(':chandId/banning/:userId/:action')
  @UseGuards(JwtGuard)
  banUser(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
    @Req() req,
  ) {
    return this.channelService.banUnbanFromChannel(
      chanId,
      userId,
      action,
      req.user.id,
    );
  }

  @Get(':chandId/muting/:userId/:action')
  @UseGuards(JwtGuard)
  mute(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
    @Req() req,
  ) {
    return this.channelService.muteUnmuteFromChannel(
      chanId,
      userId,
      action,
      req.user.id,
    );
  }

  @Get(':chandId/modding/:userId/:action')
  @UseGuards(JwtGuard)
  mod(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: string,
    @Req() req,
  ) {
    return this.channelService.modUnmodFromChannel(
      chanId,
      userId,
      action,
      req.user.id,
    );
  }
}
