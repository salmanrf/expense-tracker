import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { MUTATION_TYPES } from 'src/constants/mutation';

export class CreateMutationDto {
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsIn(MUTATION_TYPES)
  type: string;

  @IsDate()
  created_at: Date | string;

  user_id: string;
}
