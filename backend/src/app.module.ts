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
import { JwtModule } from '@nestjs/jwt';
import { FtOauthGuard } from './guards/ft_oauth.guard';
import { NotifGateway } from './notifications.gateway';

config();

@Global()
@Module({
  imports: [
    AuthModule,
    ChannelModule,
    UserModule,
    ConversationModule,
    AchievementModule,
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
    JwtModule.register({
      secret: 'f439843--213+@y4t34u',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FtOauthGuard],
})
export class AppModule {}
