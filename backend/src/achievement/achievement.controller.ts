import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { AchievementService } from './achievement.service';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';

class createAchievementDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  icon: string;
  @IsNumber()
  @IsNotEmpty()
  addedXp: number;
}

class updateAchievementDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  icon: string;
  @IsOptional()
  @IsNumber()
  addedXp: number;
}

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post('create')
  create(@Body() data: createAchievementDto) {
    return this.achievementService.createAchievement(data);
  }

  @Get()
  findAll() {
    return this.achievementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.achievementService.findAc(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() data: updateAchievementDto) {
    return this.achievementService.updateAchievement(id, data);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.achievementService.removeAchievement(id);
  }

  @Post(':achievementId/give/:userId')
  give(@Param('id') achievementId: number, userId: number) {
    return this.achievementService.giveAchievement(achievementId, userId);
  }
}
