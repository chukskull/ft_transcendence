import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @Length(3, 18)
  name: string;

  @IsString()
  @IsOptional()
  @Length(5, 20)
  password: string;

  @IsBoolean()
  is_private: boolean;
}
