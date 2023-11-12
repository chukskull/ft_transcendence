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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.channelService.getChannel(id);
  }

  @Get('myChannels')
  findMyChannels() {
    return this.channelService.getMyChannels();
  }

  @Patch('/update')
  update(@Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.updateChannel(updateChannelDto);
  }

  @Delete()
  delete(@Body() id: number) {
    return this.channelService.deleteChannel(id);
  }

  @Post('/join')
  join(@Body() data: any) {
    const { chanId, Password } = data;
    return this.channelService.joinChannel(chanId, Password);
  }

  @Post('/leave')
  leave(@Body() data) {
    const { chanId } = data;
    return this.channelService.leaveChannel(chanId);
  }
  @Post('/invite')
  invite(@Body() chanId: number, @Body() userId: number) {
    return this.channelService.inviteToChannel(chanId, userId);
  }

  @Post('/banning')
  ban(@Body() chanId: number, @Body() userId: number, @Body() action: number) {
    return this.channelService.banUnbanFromChannel(chanId, userId, action);
  }

  @Post('/muting')
  mute(@Body() chanId: number, @Body() userId: number, @Body() action: number) {
    return this.channelService.muteUnmuteFromChannel(chanId, userId, action);
  }

  @Post('/mod')
  mod(@Body() chanId: number, @Body() userId: number, @Body() action: number) {
    return this.channelService.modUnmodFromChannel(chanId, userId, action);
  }

  @Post('/owner')
  owner(@Body() chanId: number, @Body() userId: number) {
    return this.channelService.makeOwner(chanId, userId);
  }
}
