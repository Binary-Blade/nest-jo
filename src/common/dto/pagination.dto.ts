import { SortOrder } from '@common/enums/sort-order.enum';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

/**
 * Data Transfer Object (DTO) for pagination and filtering.
 * @class
 */
export class PaginationAndFilterDto {
  /**
   * The maximum number of items to return.
   *
   * @type {number}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.limit = 10;
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly limit: number;

  /**
   * The number of items to skip.
   *
   * @type {number}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.offset = 20;
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly offset: number;

  /**
   * The field to sort by.
   *
   * @type {string}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.sortBy = 'name';
   */
  @IsOptional()
  @IsString()
  readonly sortBy: string;

  /**
   * The order to sort by.
   *
   * @type {SortOrder}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.sortOrder = SortOrder.ASC;
   */
  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortOrder: SortOrder;

  /**
   * The field to filter by.
   *
   * @type {string}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.filterBy = 'status';
   */
  @IsOptional()
  @IsString()
  readonly filterBy: string;

  /**
   * The value to filter by.
   *
   * @type {string | number}
   * @readonly
   * @optional
   * @example
   * paginationAndFilterDto.filterValue = 'active';
   */
  @IsOptional()
  readonly filterValue: string | number;
}
