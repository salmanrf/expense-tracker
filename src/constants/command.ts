import { IsOptional, validateSync } from 'class-validator';
import { CreateMutationDto } from 'src/mutations/dtos/create-mutation.dto';
import { FindMutationsReportDto } from 'src/mutations/dtos/find-mutations-report.dto';
import { FindManyMutationsDto } from 'src/mutations/dtos/find-mutations.dto';

export const COMMANDS = ['mutation', 'report', 'transactions'];
export const COMMAND_KEYS = {
  MUTATION: 'mutation',
  REPORT: 'report',
  TRANSACTIONS: 'transactions',
};

export class MutationCommand extends CreateMutationDto {
  @IsOptional()
  category?: string;

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

export class TransactionsCommand extends FindManyMutationsDto {
  @IsOptional()
  page_number: number;

  @IsOptional()
  page_size: number;

  constructor(init: Partial<TransactionsCommand>) {
    super();

    Object.assign(this, init);

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }
  }
}
