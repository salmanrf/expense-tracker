import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class BasePaginationDto {
  @IsNumberString()
  page_number: number;

  @IsNumberString()
  page_size: number;

  @IsString()
  @IsOptional()
  sort_field: string;

  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  sort_order: 'DESC' | 'ASC';
}

export class BasePaginatedData<T> extends BasePaginationDto {
  items: T[];
  total_items: number;
}
