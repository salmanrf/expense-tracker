import { Body, Controller, Get, Post } from '@nestjs/common';
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
  ) {
    try {
      const result = await this.whatsappService.respondUserMessage(messageDto);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
