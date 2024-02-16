import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('currentuser')
  getHello(): string {
    return this.appService.getHello();
  }
}
