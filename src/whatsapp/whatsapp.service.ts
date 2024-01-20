import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import PdfPrinter from 'pdfmake';
import { join } from 'path';
import * as fs from 'fs';
import * as genPwd from 'generate-password';
import { AppConfig } from 'src/types/app.config';
import { TwilioMessageWebhookDto } from './dtos/twilio-message-webhook.dto';
import { parseAndGetCommand } from 'src/utils/command.utils';
import {
  MutationCommand,
  ReportCommand,
  TransactionsCommand,
} from 'src/constants/command';
import { UsersService } from 'src/users/users.service';
import { MutationsService } from 'src/mutations/mutations.service';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { FindManyMutationsDto } from 'src/mutations/dtos/find-mutations.dto';
import { formatReportPDFDef } from 'src/lib/pdf-templates';
import { PdfFonts } from 'src/lib/fonts';

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

      if (command instanceof TransactionsCommand) {
        commandResults = await this.handleTransactionsCommand(
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

  async handleTransactionsCommand(
    messageDto: TwilioMessageWebhookDto,
    command: TransactionsCommand,
    twiml: MessagingResponse,
  ): Promise<[MessagingResponse, Error | null]> {
    try {
      const user = await this.usersService.getOrCreateUser({
        phone_id: messageDto.WaId,
      });

      command.user_id = user.user_id;

      command.sort_order = 'ASC';

      const results = await this.mutationssService.findManyMutations(
        command as FindManyMutationsDto,
      );
      const pdfDocDef = formatReportPDFDef({
        user,
        mutations: results.items,
        start_date: command.created_at_start,
        end_date: command.created_at_end,
      });

      const pdfPassword = genPwd.generate({ length: 18, numbers: true });

      pdfDocDef.userPassword = pdfPassword;

      const pdfPrinter = new PdfPrinter(PdfFonts);

      const { nanoid } = await import('nanoid');

      const pdfFileId = nanoid(12);

      const pdfDoc = pdfPrinter.createPdfKitDocument(pdfDocDef as any);

      await new Promise((resolve, reject) => {
        pdfDoc.on('end', () => {
          resolve(null);
        });

        pdfDoc.on('error', (_) => {
          reject('Error when generating pdf file');
        });

        pdfDoc.pipe(
          fs.createWriteStream(
            join(__dirname, '../..', 'dump', `${pdfFileId}.pdf`),
          ),
        );

        pdfDoc.end();
      });

      twiml.message(
        `Click the link below to access your transactions pdf report:\nPassword: ${pdfPassword}`,
      );
      twiml.message(
        `${this.configService.get(
          'SERVER_URL',
        )}/api/mutations/pdf/${pdfFileId}`,
      );

      return [twiml, null];
    } catch (error) {
      return [null, error];
    }
  }

  async sendMessage(to: string, body: string) {
    const message = await this.twilioClient.messages.create({
      to,
      body,
      from: this.configService.get('TWILIO_APP_WA_ID'),
    });

    return message;
  }
}
