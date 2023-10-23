import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/types/app.config';
import * as twilio from 'twilio';
import { TwilioMessageWebhookDto } from './dtos/twilio-message-webhook.dto';
import { parseAndGetCommand } from 'src/utils/command.utils';
import { MutationCommand, ReportCommand } from 'src/constants/command';
import { UsersService } from 'src/users/users.service';
import { MutationsService } from 'src/mutations/mutations.service';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

@Injectable()
export class WhatsappService {
  private readonly twilioClient: twilio.Twilio;

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly mutationssService: MutationsService,
    private readonly usersService: UsersService,
  ) {
    const twilioClient = twilio(
      configService.get('TWILIO_ACCOUNT_SID'),
      configService.get('TWILIO_AUTH_TOKEN'),
    );

    this.twilioClient = twilioClient;
  }

  async respondUserMessage(messageDto: TwilioMessageWebhookDto) {
    const twiml = new twilio.twiml.MessagingResponse();

    try {
      const [command, error] = parseAndGetCommand(messageDto.Body);

      if (error) {
        twiml.message(error.message);

        return twiml.toString();
      }

      let commandResults: [MessagingResponse, Error | null];

      if (command instanceof MutationCommand) {
        commandResults = await this.handleMutationCommand(
          messageDto,
          command,
          twiml,
        );
      }

      if (command instanceof ReportCommand) {
        commandResults = await this.handleReportCommand(
          messageDto,
          command,
          twiml,
        );
      }

      const [, err] = commandResults;

      if (err) {
        twiml.message(err.message);

        return twiml.toString();
      }

      return twiml.toString();
    } catch (error) {
      console.log('ERROR', error);

      twiml.message(`Unexpected error ${error}`);

      return twiml.toString();
    }
  }

  async handleMutationCommand(
    messageDto: TwilioMessageWebhookDto,
    command: MutationCommand,
    twiml: MessagingResponse,
  ): Promise<[MessagingResponse, Error | null]> {
    try {
      const user = await this.usersService.getOrCreateUser({
        phone_id: messageDto.WaId,
      });

      command.user_id = user.user_id;

      const newMutation = await this.mutationssService.createMutation(command);

      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      twiml.message(
        'Mutation saved successfully: \n' +
          `Id: ${newMutation.mutation_id} \n` +
          `Type: ${newMutation.type} \n` +
          `Transaction Date: ${newMutation.created_at} \n` +
          `Amount: ${formatter.format(newMutation.amount)} \n` +
          `Category: ${(command.category || 'OTHERS').toUpperCase()}`,
      );

      return [twiml, null];
    } catch (error) {
      console.log('ERROR', error);

      return [null, error];
    }
  }

  async handleReportCommand(
    messageDto: TwilioMessageWebhookDto,
    command: ReportCommand,
    twiml: MessagingResponse,
  ): Promise<[MessagingResponse, Error | null]> {
    try {
      const user = await this.usersService.getOrCreateUser({
        phone_id: messageDto.WaId,
      });

      const results = await this.mutationssService.findMutationsReport(
        user.user_id,
        command,
      );

      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      twiml.message(
        `Here is your expense report for this ${command.period_type}:\n`,
      );

      results.items.forEach(({ amount, category }) => {
        twiml.message(
          `${(category || 'others').toUpperCase()}: ${formatter.format(
            amount,
          )}\n`,
        );
      });

      return [twiml, null];
    } catch (error) {
      return [null, error];
    }
  }

  async sendMessage() {
    const message = await this.twilioClient.messages.create({
      from: this.configService.get('TWILIO_APP_WA_ID'),
      body: 'Hello World!',
      to: 'whatsapp:+628979253935',
    });

    console.log('Message', message);
  }
}
