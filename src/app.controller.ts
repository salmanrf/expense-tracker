import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthcheck')
  async getHello(): Promise<string> {
    return 'I am healthy';
  }
}
