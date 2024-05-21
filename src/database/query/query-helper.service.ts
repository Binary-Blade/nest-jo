import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class QueryHelperService {
  buildQueryOptions<TypeEntity>(
    paginationFilterDto: PaginationAndFilterDto
  ): FindManyOptions<TypeEntity> {
    const {
      limit,
      offset,
      sortBy,
      sortOrder = SortOrder.ASC,
      filterBy,
      filterValue
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

  createNestedOrder(sortBy: string, sortOrder: 'ASC' | 'DESC') {
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
