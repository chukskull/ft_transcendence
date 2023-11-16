import { AppService } from './app.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from './guards/ft_oauth.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('protected')
  // @UseGuards(JwtAuthGuard)
  // getProtected(): string {
  //   return 'Protected route';
  // }
}
