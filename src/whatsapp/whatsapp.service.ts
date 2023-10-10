import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/types/app.config';
import * as twilio from 'twilio';
import { TwilioMessageWebhookDto } from './dtos/twilio-message-webhook.dto';

@Injectable()
export class WhatsappService {
  private readonly twilioClient: twilio.Twilio;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const twilioClient = twilio(
      configService.get('TWILIO_ACCOUNT_SID'),
      configService.get('TWILIO_AUTH_TOKEN'),
    );

    this.twilioClient = twilioClient;
  }

  async respondUserMessage(messageDto: TwilioMessageWebhookDto) {
    try {
      const twiml = new twilio.twiml.MessagingResponse();

      twiml.message(`You said: ${messageDto.Body}, wdym ?`);

      console.log('twiml', twiml);

      return twiml.toString();
    } catch (error) {}
  }

  async sendMessage() {
    const message = await this.twilioClient.messages.create({
      from: this.configService.get('TWILIO_APP_WA_ID'),
      body: 'Hello World!',
      to: 'whatsapp:+628979253935',
    });

    console.log('Sent Message', message);
  }
}
