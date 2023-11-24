import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Get,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { JwtGuard } from 'src/auth/Jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  create(@Body() createChannelDto: CreateChannelDto, @Req() req) {
    return this.channelService.createChannel(createChannelDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.channelService.getChannels();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number, @Req() req) {
    return this.channelService.getChannel(id, req.user.id);
  }

  @Get('myChannels')
  @UseGuards(JwtGuard)
  findMyChannels(@Req() req) {
    return this.channelService.getMyChannels(req.user.id);
  }

  @Get(':id/chat')
  @UseGuards(JwtGuard)
  findChat(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.channelService.getChannelChat(userId, id);
  }

  @Patch('/update')
  @UseGuards(JwtGuard)
  update(@Body() updateChannelDto: UpdateChannelDto, @Req() req) {
    return this.channelService.updateChannel(updateChannelDto, req.user.id);
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

  @Post(':chanId/leave')
  @UseGuards(JwtGuard)
  leave(@Param('chanId') chanId: number, @Req() req) {
    if (chanId == 1337) {
      return { message: 'Cannot leave general channel' };
    }

    return this.channelService.leaveChannel(chanId, req.user.id);
  }

  @Post(':chandId/invite/:userId')
  @UseGuards(JwtGuard)
  invite(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Req() req,
  ) {
    return this.channelService.inviteToChannel(chanId, userId, req.user.id);
  }

  @Post(':chandId/banning/:userId/:action')
  @UseGuards(JwtGuard)
  ban(
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

  @Post(':chandId/muting/:userId/:action')
  @UseGuards(JwtGuard)
  mute(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
  ) {
    return this.channelService.muteUnmuteFromChannel(chanId, userId, action);
  }

  @Post(':chandId/modding/:userId/:action')
  @UseGuards(JwtGuard)
  mod(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
  ) {
    return this.channelService.modUnmodFromChannel(chanId, userId, action);
  }

  @Post(':chandId/owner/:userId')
  @UseGuards(JwtGuard)
  owner(@Param('chandId') chanId: number, @Param('userId') userId: number) {
    return this.channelService.makeOwner(chanId, userId);
  }
}
