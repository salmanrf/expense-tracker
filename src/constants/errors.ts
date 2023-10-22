import {
  AvailableCommandMessage,
  MutationCommandFormatMessage,
  ReportCommandFormatMessage,
} from './templates';

export const UnrecognizedCommandMessage =
  'Unrecognized command, available commands are:\n' + AvailableCommandMessage;

export const InvalidFormatMessage =
  'Invalid format, available commands are: \n' + AvailableCommandMessage;

export const InvalidDateFormatMessage = `Invalid date, must either be in the following formats:
* YYYY-MM-DD, example: 1999-10-01
* DD/MM/YYYY, example: 01/10/1999
`;

export class UnrecognizedCommandError extends Error {
  constructor(message?: string) {
    super(message || UnrecognizedCommandMessage);
  }
}

export class InvalidFormatError extends Error {
  constructor(message?: string) {
    super(message || InvalidFormatMessage);
  }
}

export class InvalidMutationFormatError extends Error {
  constructor(message?: string) {
    super(message || MutationCommandFormatMessage);
  }
}

export class InvalidReportFormatError extends Error {
  constructor(message?: string) {
    super(message || ReportCommandFormatMessage);
  }
}

export class InvalidDateFormatError extends Error {
  constructor(message?: string) {
    super(message || InvalidDateFormatMessage);
  }
}
