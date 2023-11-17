import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
// import { AuthService } from 'src/user/auth/auth.service';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './auth/models/constants';
import { Channel } from '../channel/channel.entity';
import { Conversation } from '../conversations/conversation.entity';
import { Achievement } from '../achievement/achievement.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Conversation, Achievement]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
