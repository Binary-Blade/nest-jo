import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { QueryHelperService } from '@database/query/query-helper.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let queryHelperService: QueryHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: QueryHelperService,
          useValue: {
            buildQueryOptions: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    queryHelperService = module.get<QueryHelperService>(QueryHelperService);
  });

  describe('createTransaction', () => {
    it('should create and update user transaction successfully', async () => {
      const user = { userId: 1, transactionsCount: 0, totalSpent: 0 } as User;
      const paymentResult: PaymentResult = {
        status: StatusReservation.APPROVED,
        detail: 'Success'
      };
      const transaction = {} as Transaction;

      jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
      jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

      const result = await service.createTransaction(user, 100, paymentResult);
      expect(result).toBe(transaction);
      expect(transactionRepository.create).toHaveBeenCalledWith({
        user,
        paymentId: expect.any(Number),
        totalAmount: 100,
        statusPayment: 'APPROVED'
      });
      expect(transactionRepository.save).toHaveBeenCalledWith(transaction);
      expect(userRepository.update).toHaveBeenCalledWith(user.userId, {
        transactionsCount: 1,
        totalSpent: 100
      });
    });
  });

  describe('findTransactionByReservationId', () => {
    it('should find a transaction by reservation ID', async () => {
      const transaction = {} as Transaction;

      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(transaction);

      const result = await service.findTransactionByReservationId(1);
      expect(result).toBe(transaction);
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { reservation: { reservationId: 1 } },
        relations: ['reservation']
      });
    });

    it('should throw NotFoundException if the transaction does not exist', async () => {
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findTransactionByReservationId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateCartTotal', () => {
    it('should calculate the total price of a cart', () => {
      const cartItems: CartItem[] = [
        { price: 10, quantity: 2 } as CartItem,
        { price: 20, quantity: 1 } as CartItem
      ];

      const result = service.calculateCartTotal(cartItems);
      expect(result).toBe(40);
    });
  });

  describe('findAll', () => {
    it('should return all transactions with pagination and filtering', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
        filterBy: 'Test',
        filterValue: 'Value'
      };
      const transactions = [{}] as Transaction[];
      const total = 1;

      jest.spyOn(queryHelperService, 'buildQueryOptions').mockReturnValue({
        where: { user: { userId } },
        relations: [
          'user',
          'reservation',
          'reservation.ticket',
          'reservation.reservationDetails',
          'reservation.reservationDetails.event'
        ],
        select: expect.anything(),
        order: { createdAt: 'DESC' }
      });
      jest.spyOn(transactionRepository, 'findAndCount').mockResolvedValue([transactions, total]);

      const result = await service.findAll(userId, paginationFilterDto);
      expect(result).toEqual({ transactions, total });
      expect(queryHelperService.buildQueryOptions).toHaveBeenCalledWith(paginationFilterDto, 5);
      expect(transactionRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: [
          'user',
          'reservation',
          'reservation.ticket',
          'reservation.reservationDetails',
          'reservation.reservationDetails.event'
        ],
        select: expect.anything(),
        order: { createdAt: 'DESC' }
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
        filterBy: 'Test',
        filterValue: 'Value'
      };

      jest.spyOn(queryHelperService, 'buildQueryOptions').mockReturnValue({
        where: { user: { userId } },
        relations: [
          'user',
          'reservation',
          'reservation.ticket',
          'reservation.reservationDetails',
          'reservation.reservationDetails.event'
        ],
        select: expect.anything(),
        order: { createdAt: 'DESC' }
      });
      jest.spyOn(transactionRepository, 'findAndCount').mockRejectedValue(new Error('Error'));

      await expect(service.findAll(userId, paginationFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
