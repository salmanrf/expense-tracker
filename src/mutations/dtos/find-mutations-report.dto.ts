import { IsIn, IsOptional, IsString } from 'class-validator';
import { PERIOD_TYPES } from 'src/constants/mutation';
import { MutationPeriodType } from 'src/types/mutation-report';

export class FindMutationsReportDto {
  @IsString()
  @IsOptional()
  @IsIn(PERIOD_TYPES)
  period_type?: MutationPeriodType;

  @IsString()
  @IsOptional()
  category?: string;
}
