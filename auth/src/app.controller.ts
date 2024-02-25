import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('signup')
  signup(): string {
    return this.appService.getHello();
  }

  @Post('signin')
  signin(): string {
    return this.appService.getHello();
  }

  @Post('signout')
  signout(): string {
    return this.appService.getHello();
  }

  @Get('current-user')
  getHello(): string {
    return this.appService.getHello();
  }
}
