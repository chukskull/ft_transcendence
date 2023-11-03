import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, UpdateChannelDto } from

@Controller('channel')
export class ChannelController
{
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  findAll() {
    return this.channelService.getChannels();
  }

  @Get(':userId')
  findAll() {
    return this.channelService.getChannels();
  }

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  @Patch(':chanId')
  update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.updateChannel(id, updateChannelDto);
  }

  @Delete(':chanId')
  delete(@Param('id') id: number) {
    return this.channelService.deleteChannel(id);
  }

  @Post(':chanId/join')
  join(@Param('id') id: number) {
    return this.channelService.joinChannel(id);
  }

  @Post(':chanId/leave')
  leave(@Param('id') id: number) {
    return this.channelService.leaveChannel(id);
  }

  @Post(':chanId/banning/:userId/:action')
  ban(@Param('id') id: number) {
    return this.channelService.banUser(id);
  }

  @Post(':chanId/muting/:userId/:action')
  mute(@Param('id') id: number) {
    return this.channelService.muteUser(id);
  }

  @Post(':chanId/invite/:userId')
  invite(@Param('id') id: number) {
    return this.channelService.inviteUser(id);
  }

  @Post(':chanId/mod/:userId/:action')
  mod(@Param('id') id: number) {
    return this.channelService.modUser(id);
  }

  @Post(':chanId/owner/:userId/')
  owner(@Param('id') id: number) {
    return this.channelService.ownerUser(id);
  }

}
