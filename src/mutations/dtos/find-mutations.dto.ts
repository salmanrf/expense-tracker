import {
  IsDateString,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { MUTATION_TYPES } from 'src/constants/mutation';
import { BasePaginationDto } from 'src/dtos/pagination.dto';

export class FindManyMutationsDto extends BasePaginationDto {
  @IsNumberString()
  @IsOptional()
  amount_start?: number;

  @IsNumberString()
  @IsOptional()
  amount_end?: number;

  @IsDateString()
  @IsOptional()
  created_at_start?: string;

  @IsDateString()
  @IsOptional()
  created_at_end?: string;

  @IsIn(MUTATION_TYPES)
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsOptional()
  user_id?: string;
}
