import { IsString, IsBoolean, Length } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @Length(3, 18)
  name: string;

  @IsString()
  @Length(5, 20)
  password: string;

  @IsBoolean()
  is_private: boolean;
}
