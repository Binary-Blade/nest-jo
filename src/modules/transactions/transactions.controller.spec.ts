import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { AccessTokenGuard } from '@security/guards';
import { Reflector } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { SortOrder } from '@common/enums/sort-order.enum';
import { Transaction } from './entities/transaction.entity';
import { User } from '@modules/users/entities/user.entity';
import { StatusReservation } from '@common/enums/status-reservation.enum';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            findAll: jest.fn()
          }
        },
        {
          provide: APP_GUARD,
          useValue: new AccessTokenGuard(new Reflector())
        }
      ]
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
        filterBy: 'Test',
        filterValue: 'Value'
      };
      const transactions: Transaction[] = [
        {
          transactionId: 1,
          user: {} as User,
          reservation: null,
          statusPayment: StatusReservation.APPROVED,
          paymentId: 12345,
          totalAmount: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      const total = 1;

      jest.spyOn(service, 'findAll').mockResolvedValue({ transactions, total });

      const result = await controller.findAll(userId, paginationFilterDto);
      expect(result).toEqual({ transactions, total });
      expect(service.findAll).toHaveBeenCalledWith(userId, paginationFilterDto);
    });
  });
});
