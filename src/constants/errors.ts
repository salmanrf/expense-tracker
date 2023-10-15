import {
  AvailableCommandMessage,
  MutationCommandFormatMessage,
  ReportCommandFormatMessage,
} from './templates';

export const UnrecognizedCommandMessage =
  'Unrecognized command, available commands are:\n' + AvailableCommandMessage;

export const InvalidFormatMessage =
  'Invalid format, available commands are: \n' + AvailableCommandMessage;

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
