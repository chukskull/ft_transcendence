import { IsString, IsBoolean } from 'class-validator';


export class CreateChannelDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsBoolean()
  is_private: boolean;
}
