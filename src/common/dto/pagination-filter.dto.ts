import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PaginationAndFilterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly limit: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly offset: number;

  @IsOptional()
  @IsString()
  readonly sortBy: string; // e.g., 'title', 'startDate'

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortOrder: SortOrder; // 'ASC' or 'DESC'

  @IsOptional()
  @IsString()
  readonly filterBy: string; // Optional field to filter by, e.g., 'categoryType'

  @IsOptional()
  readonly filterValue: string | number; // Value for the filter
}
