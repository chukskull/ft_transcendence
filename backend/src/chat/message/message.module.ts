import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([message])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
