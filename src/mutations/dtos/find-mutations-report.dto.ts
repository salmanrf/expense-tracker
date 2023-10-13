import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindMutationsReportDto {
  @IsString()
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'year'])
  period_type: string;
}
