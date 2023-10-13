import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MUTATION_TYPES } from 'src/constants/mutation';

export class CreateMutationDto {
  @IsNumber()
  @IsOptional()
  category_id: number;

  @IsString()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsIn(MUTATION_TYPES)
  type: string;

  @IsDateString()
  created_at: Date | string;
}
