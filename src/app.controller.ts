import { Controller, Get, Injectable } from '@nestjs/common';

@Injectable()
@Controller('/')
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
