import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TwilioMessageWebhookDto } from './dtos/twilio-message-webhook.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  async hello() {
    return 'Hello from twilio';
  }

  @Post('/message')
  async handleTwilioWebhookMessage(
    @Body() messageDto: TwilioMessageWebhookDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.whatsappService.respondUserMessage(messageDto);

      res.setHeader('Content-Type', 'application/xml');

      res.send(result);
    } catch (error) {
      console.log('ERROR at handleTwilioWebhookMessage', error);

      throw error;
    }
  }
}
