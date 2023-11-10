import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Get,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('create')
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.getChannels();
  }

  @Get('myChannels')
  findMyChannels() {
    return this.channelService.getMyChannels();
  }

  @Patch()
  update(@Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.updateChannel(updateChannelDto);
  }

  @Delete()
  delete(@Body() id: number) {
    return this.channelService.deleteChannel(id);
  }

  @Post(':chanId/join')
  join(@Param('chanId') chanId: number, @Body() Password: string) {
    return this.channelService.joinChannel(chanId, Password);
  }

  @Post(':chanId/leave')
  leave(@Param('chanId') chanId: number) {
    return this.channelService.leaveChannel(chanId);
  }
  @Post(':chanId/invite/:userId')
  invite(@Param('chanId') chanId: number, @Param('userId') userId: number) {
    return this.channelService.inviteToChannel(chanId, userId);
  }

  @Post(':chanId/banning/:userId/:action')
  ban(@Param('chanId') chanId: number, @Param('userId') userId: number, @Param('action') action: number) {
    return this.channelService.banUnbanFromChannel(chanId, userId, action);
  }

  @Post(':chanId/muting/:userId/:action')
  mute(@Param('chanId') chanId: number, @Param('userId') userId: number, @Param('action') action: number) {
    return this.channelService.muteUnmuteFromChannel(chanId, userId, action);
  }


  @Post(':chanId/mod/:userId/:action')
  mod(@Param('chanId') chanId: number, @Param('userId') userId: number, @Param('action') action: number) {
    return this.channelService.modUnmodFromChannel(chanId, userId, action);
  }

  @Post(':chanId/owner/:userId/')
  owner(@Param('chanId') chanId: number, @Param('userId') userId: number) {
    return this.channelService.makeOwner(chanId, userId);
  }
}
