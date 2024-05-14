import { SortOrder } from '@common/enums/sort-order.enum';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

/**
 * Data transfer object for pagination and filtering.
 *
 * @export PaginationAndFilterDto
 * @class PaginationAndFilterDto
 * @property {number} limit The maximum number of items to return
 * @property {number} offset The number of items to skip
 * @property {string} sortBy The field to sort by
 * @property {SortOrder} sortOrder The sort order
 * @property {string} filterBy The field to filter by
 * @property {string | number} filterValue The value to filter by
 */
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
