import { validateSync } from 'class-validator';
import { CreateMutationDto } from 'src/mutations/dtos/create-mutation.dto';
import { FindMutationsReportDto } from 'src/mutations/dtos/find-mutations-report.dto';

export const COMMANDS = ['mutation', 'report'];
export const COMMAND_KEYS = {
  MUTATION: 'mutation',
  REPORT: 'report',
};

export class MutationCommand extends CreateMutationDto {
  constructor(init: Partial<MutationCommand>) {
    super();

    Object.assign(this, init);

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }
  }
}

export class ReportCommand extends FindMutationsReportDto {
  constructor(init: Partial<ReportCommand>) {
    super();

    Object.assign(this, init);

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }
  }
}
