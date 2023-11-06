import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './user/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChatGatewayModule } from './chat/chat-gateway.module';
import { ChannelModule } from './channel/channel.module';
// import { MessageModule } from './chat/message/message.module';

@Module({
  imports: [
    // AuthModule,
    // ChatGatewayModule,
    ChannelModule,
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
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
