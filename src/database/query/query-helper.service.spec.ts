import { Test, TestingModule } from '@nestjs/testing';
import { QueryHelperService } from './query-helper.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';

describe('QueryHelperService', () => {
  let service: QueryHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryHelperService]
    }).compile();

    service = module.get<QueryHelperService>(QueryHelperService);
  });

  describe('buildQueryOptions', () => {
    it('should build query options correctly', () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
        filterBy: 'status',
        filterValue: 'active'
      };

      const result = service.buildQueryOptions(paginationFilterDto);

      expect(result).toEqual({
        where: { status: 'active' },
        order: { name: 'DESC' },
        skip: 0,
        take: 10
      });
    });
  });

  describe('buildWhereCondition', () => {
    it('should return empty condition when no filterBy and filterValue', () => {
      const result = service['buildWhereCondition']();
      expect(result).toEqual({});
    });

    it('should build nested where condition correctly', () => {
      const result = service['buildWhereCondition']('user.name', 'John');
      expect(result).toEqual({ user: { name: 'John' } });
    });

    it('should handle ALL filter value correctly', () => {
      const result = service['buildWhereCondition']('status', 'ALL');
      expect(result).toEqual({});
    });
  });

  describe('createNestedOrder', () => {
    it('should build nested order correctly', () => {
      const result = service.createNestedOrder('user.name', 'ASC');
      expect(result).toEqual({ user: { name: 'ASC' } });
    });

    it('should handle single level order correctly', () => {
      const result = service.createNestedOrder('name', 'DESC');
      expect(result).toEqual({ name: 'DESC' });
    });
  });
});
