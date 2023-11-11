import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchHistoryDto) {
    return this.matchHistoryService.create(createMatchDto);
  }
}
