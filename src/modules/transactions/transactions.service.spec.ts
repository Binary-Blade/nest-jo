import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { StatusReservation } from '@common/enums/status-reservation.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const user = { userId: 1 } as User;
      const paymentResult: PaymentResult = {
        status: StatusReservation.APPROVED,
        detail: 'Success'
      };
      const transaction = {} as Transaction;

      jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
      jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);

      const result = await service.createTransaction(user, 100, paymentResult);
      expect(result).toBe(transaction);
      expect(transactionRepository.create).toHaveBeenCalledWith({
        user,
        paymentId: expect.any(Number),
        totalAmount: 100,
        statusPayment: StatusReservation.APPROVED
      });
      expect(transactionRepository.save).toHaveBeenCalledWith(transaction);
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
});
