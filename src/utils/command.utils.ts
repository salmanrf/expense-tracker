import * as dfns from 'date-fns';

import {
  COMMANDS,
  COMMAND_KEYS,
  MutationCommand,
  ReportCommand,
} from 'src/constants/command';
import {
  InvalidFormatError,
  InvalidMutationFormatError,
  InvalidReportFormatError,
  UnrecognizedCommandError,
} from 'src/constants/errors';
import { MUTATION_TYPES, PERIOD_TYPES } from 'src/constants/mutation';
import { MutationPeriodType } from 'src/types/mutation-report';
import { parseDateFromString } from './date.utils';
import { InvalidMutationAmountMessage } from 'src/constants/templates';

export function parseAndGetCommand(
  message: string,
): [object | null, Error | null] {
  const words = message.split(' ');

  let command = words[0];

  if (!/^\/[a-zA-Z]+$/.test(command)) {
    return [null, new InvalidFormatError()];
  }

  command = command.replaceAll('/', '');

  if (!COMMANDS.includes(command)) {
    return [null, new UnrecognizedCommandError()];
  }

  if (command === COMMAND_KEYS.MUTATION) {
    const commandDto = parseMutationCommand(words.slice(1));

    return commandDto;
  }

  if (command === COMMAND_KEYS.REPORT) {
    const commandDto = parseReportCommand(words.slice(1));

    return commandDto;
  }

  return [null, new UnrecognizedCommandError()];
}

export function parseMutationCommand(
  command_arguments: string[],
): [MutationCommand | null, Error | null] {
  `
  Parse and instantiate MutationCommand class,
  expects command arguments (not including the command itself)
  
  The 'mutation' command arguments should be in the format:
  <type> <transaction_date>? <amount> <category>? <description>?
  
  Examples:
  - OUT 2023-10-13 120000 hobby "steam winter sale"
  - IN 2023-10-01 120000000 salary "oct salary"

  Note: arguments <name> marked with '?' are optional 

  returns a tuple containing the command class, and an error, if any.
  `;

  const copied_args = [...command_arguments];

  if (!copied_args || copied_args.length === 0) {
    return [null, new InvalidMutationFormatError()];
  }

  const mutationType = copied_args.shift();

  if (!MUTATION_TYPES.includes(mutationType)) {
    return [null, new InvalidMutationFormatError()];
  }

  const trxDateStr = copied_args.shift();
  const parsedDate = parseDateFromString(trxDateStr);
  let [trxDate] = parsedDate;
  const [, dateError] = parsedDate;

  let amount: number = +copied_args.shift();

  if (dateError) {
    trxDate = dfns.startOfDay(new Date());
    amount = +trxDateStr;

    if (!amount || amount <= 0) {
      return [
        null,
        new InvalidMutationFormatError(
          `${dateError.message}
${InvalidMutationAmountMessage}
          `,
        ),
      ];
    }
  }

  if (!amount || amount <= 0) {
    return [null, new InvalidMutationFormatError(InvalidMutationAmountMessage)];
  }

  const category = copied_args.shift();
  const description = copied_args.shift();

  return [
    new MutationCommand({
      amount,
      category,
      description,
      created_at: trxDate,
      type: mutationType,
    }),
    null,
  ];
}

export function parseReportCommand(
  command_arguments: string[],
): [ReportCommand | null, Error | null] {
  `
  Parse and instantiate ReportCommand class,
  expects command arguments (not including the command itself)
  
  The 'report' command arguments should be in the format:
  <period_type>
  
  Examples:
  - day
  - week
  - month
  - year

  returns a tuple containing the command class, and an error, if any.
  `;

  const copied_args = [...command_arguments];

  if (!copied_args || copied_args.length === 0) {
    return [null, new InvalidReportFormatError()];
  }

  const period_type = copied_args.shift() as MutationPeriodType;

  if (!PERIOD_TYPES.includes(period_type)) {
    return [null, new InvalidReportFormatError()];
  }

  const category = copied_args.shift();

  return [new ReportCommand({ period_type, category }), null];
}
