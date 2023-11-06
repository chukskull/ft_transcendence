import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  is_private: boolean;

  @IsOptional()
  @IsArray()
  members: number[];
}
