import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

/**
 * Service to build query options for database operations.
 * @class
 */
@Injectable()
export class QueryHelperService {
  /**
   * Constructs query options for pagination, sorting, and filtering.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination, sorting, and filtering data.
   * @param {number} [limitPut] - Optional limit override.
   * @returns {FindManyOptions<TypeEntity>} - The constructed query options.
   *
   * @example
   * const options = queryHelperService.buildQueryOptions<User>(paginationDto, 20);
   */
  buildQueryOptions<TypeEntity>(
    paginationFilterDto: PaginationAndFilterDto,
    limitPut?: number
  ): FindManyOptions<TypeEntity> {
    const {
      limit = limitPut || 10, // Default limit if not provided
      offset, // Number of records to skip
      sortBy, // Field to sort by
      sortOrder = SortOrder.ASC, // Default sort order
      filterBy, // Field to filter by
      filterValue // Value to filter by
    } = paginationFilterDto;

    const whereCondition = this.buildWhereCondition<TypeEntity>(filterBy, filterValue);
    const orderCondition = sortBy ? this.createNestedOrder(sortBy, sortOrder) : {};

    return {
      where: whereCondition,
      order: orderCondition,
      skip: offset,
      take: limit
    };
  }

  /**
   * Constructs the where condition for filtering.
   *
   * @param {string} [filterBy] - Field to filter by.
   * @param {string | number} [filterValue] - Value to filter by.
   * @returns {FindOptionsWhere<TypeEntity>} - The constructed where condition.
   *
   * @example
   * const where = queryHelperService.buildWhereCondition<User>('name', 'John');
   */
  private buildWhereCondition<TypeEntity>(
    filterBy?: string,
    filterValue?: string | number
  ): FindOptionsWhere<TypeEntity> {
    let whereCondition: FindOptionsWhere<TypeEntity> = {};

    if (filterBy && filterValue && filterValue !== 'ALL') {
      const nestedFields = filterBy.split('.');
      let currentField = whereCondition;
      nestedFields.forEach((field, index) => {
        if (index === nestedFields.length - 1) {
          currentField[field] = filterValue;
        } else {
          currentField[field] = {};
          currentField = currentField[field];
        }
      });
    }
    return whereCondition;
  }

  /**
   * Creates nested order conditions for sorting.
   *
   * @param {string} sortBy - Field to sort by, can be nested.
   * @param {'ASC' | 'DESC'} sortOrder - Order direction (ascending or descending).
   * @returns {object} - The constructed order condition.
   *
   * @example
   * const order = queryHelperService.createNestedOrder('address.city', 'ASC');
   */
  createNestedOrder(sortBy: string, sortOrder: 'ASC' | 'DESC'): object {
    const orderParts = sortBy.split('.');
    const order = {};
    let currentPart = order;
    orderParts.forEach((part, index) => {
      if (index === orderParts.length - 1) {
        currentPart[part] = sortOrder;
      } else {
        currentPart[part] = {};
        currentPart = currentPart[part];
      }
    });
    return order;
  }
}
