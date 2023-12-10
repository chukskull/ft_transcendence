import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from './channel/channel.module';
import { AchievementModule } from './achievement/achievement.module';
import { ConversationModule } from './conversations/conversation.module';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { GameModule } from './game/game.module';
import { MatchHistoryModule } from './match-history/match-history.module';

config();

@Global()
@Module({
  imports: [
    AuthModule,
    ChannelModule,
    UserModule,
    ConversationModule,
    GameModule,
    MatchHistoryModule,
    AchievementModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
