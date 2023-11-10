import { IsOptional, IsString, IsBoolean, IsArray , IsNumber, IsNotEmpty
} from 'class-validator';

export class UpdateChannelDto {

  @IsNotEmpty()
  @IsNumber()
  id: number;
  
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
