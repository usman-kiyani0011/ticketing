import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('signup')
  signup(@Body() body: any) {
    return this.appService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: any) {
    return this.appService.getHello();
  }

  @Post('signout')
  signout(): string {
    return this.appService.getHello();
  }

  @Get('current-user')
  currentUser(): string {
    return this.appService.getHello();
  }
}
