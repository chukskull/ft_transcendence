import {
  Controller,
  Post,
  Body,
  // Param,
  // Delete,
  // Patch,
  Get,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos/create-channel.dto';
// import { UpdateChannelDto } from './dtos/update-channel.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.getChannels();
  }
  // @Patch(':chanId')
  // update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
  //   return this.channelService.updateChannel(id, updateChannelDto);
  // }

  // @Delete(':chanId')
  // delete(@Param('id') id: number) {
  //   return this.channelService.deleteChannel(id);
  // }

  // @Post(':chanId/join')
  // join(@Param('id') id: number) {
  //   return this.channelService.joinChannel(id);
  // }

  // @Post(':chanId/leave')
  // leave(@Param('id') id: number) {
  //   return this.channelService.leaveChannel(id);
  // }

  // @Post(':chanId/banning/:userId/:action')
  // ban(@Param('id') id: number) {
  //   return this.channelService.banUnbanFromChannel(id, 14124);
  // }

  // @Post(':chanId/muting/:userId/:action')
  // mute(@Param('id') id: number) {
  //   return this.channelService.muteUnmuteFromChannel(id, 14124);
  // }

  // @Post(':chanId/invite/:userId')
  // invite(@Param('id') id: number) {
  //   return this.channelService.inviteToChannel(id, 14124);
  // }

  // @Post(':chanId/mod/:userId/:action')
  // mod(@Param('id') id: number) {
  //   return this.channelService.modUnmodFromChannel(id, 14124);
  // }

  // @Post(':chanId/owner/:userId/')
  // owner(@Param('id') id: number) {
  //   return this.channelService.makeOwner(id, 14124);
  // }
}
