import { Controller, Post, Body} from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryDto } from './dto/match-history.dto';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  create(@Body() createMatchDto: MatchHistoryDto) {
    return this.matchHistoryService.create(createMatchDto);
  }
}
