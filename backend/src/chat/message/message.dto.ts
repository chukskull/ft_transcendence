import { IsNotEmpty } from 'class-validator';

export class messageDto {
  msgId: number;

  @IsNotEmpty()
  channelId: number;

  @IsNotEmpty()
  senderId: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  timestamp: string;
}
