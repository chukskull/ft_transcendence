import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './user/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from './channel/channel.module';
import { AchievementModule } from './achievement/achievement.module';
import { ConversationModule } from './conversations/conversation.module';

@Module({
  imports: [
    // AuthModule,
    // ChatGatewayModule,
    ChannelModule,
    UserModule,
    AchievementModule,
    ConversationModule,
    // MessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    // UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'mountassir',
      password: 'admin',
      database: 'transDb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AchievementModule,
    // MatchHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
