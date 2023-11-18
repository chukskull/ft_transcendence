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
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('create')
  @UseGuards(AuthGuard('42'))
  create(@Body() createChannelDto: CreateChannelDto, @Req() req) {
    return this.channelService.createChannel(createChannelDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('42'))
  findAll() {
    return this.channelService.getChannels();
  }

  @Get(':id')
  @UseGuards(AuthGuard('42'))
  findOne(@Param('id') id: number) {
    return this.channelService.getChannel(id);
  }

  @Get('myChannels')
  @UseGuards(AuthGuard('42'))
  findMyChannels(@Req() req) {
    return this.channelService.getMyChannels(req.user.id);
  }

  @Patch('/update')
  @UseGuards(AuthGuard('42'))
  update(@Body() updateChannelDto: UpdateChannelDto, @Req() req) {
    return this.channelService.updateChannel(updateChannelDto, req.user.id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('42'))
  delete(@Param('id') id: number, @Req() req) {
    return this.channelService.deleteChannel(id, req.user.id);
  }

  @Post('/join')
  join(@Body() data: any, @Req() req) {
    const { chanId, Password } = data;
    return this.channelService.joinChannel(chanId, Password, req.user.id);
  }

  @Post(':chanId/leave')
  leave(@Param('chanId') chanId: number, @Req() req) {
    return this.channelService.leaveChannel(chanId, req.user.id);
  }
  @Post(':chandId/invite/:userId')
  invite(@Param('chandId') chanId: number, @Param('userId') userId: number, @Req() req) {
    return this.channelService.inviteToChannel(chanId, userId, req.user.id);
  }

  @Post(':chandId/banning/:userId/:action')
  @UseGuards(AuthGuard('42'))
  ban(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
    @Req() req,
  ) {
    return this.channelService.banUnbanFromChannel(chanId, userId, action, req.user.id);
  }

  @Post(':chandId/muting/:userId/:action')
  @UseGuards(AuthGuard('42'))
  mute(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
  ) {
    return this.channelService.muteUnmuteFromChannel(chanId, userId, action);
  }

  @Post(':chandId/modding/:userId/:action')
  @UseGuards(AuthGuard('42'))
  mod(
    @Param('chandId') chanId: number,
    @Param('userId') userId: number,
    @Param('action') action: number,
  ) {
    return this.channelService.modUnmodFromChannel(chanId, userId, action);
  }

  @Post(':chandId/owner/:userId')
  @UseGuards(AuthGuard('42'))
  owner(@Param('chandId') chanId: number, @Param('userId') userId: number) {
    return this.channelService.makeOwner(chanId, userId);
  }
}
