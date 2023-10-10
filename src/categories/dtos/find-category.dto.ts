import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/dtos/pagination.dto';

export class FindManyCategoriesDto extends BasePaginationDto {
  @IsString()
  @IsOptional()
  name: string;
}
