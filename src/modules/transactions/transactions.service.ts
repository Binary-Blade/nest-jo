import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { QueryHelperService } from '@database/query/query-helper.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';

/**
 * Service to manage transactions.
 * @class
 */
@Injectable()
export class TransactionsService {
  /**
   * Logger instance.
   *
   * @private
   * @memberof TransactionsService
   * @type {Logger}
   *
   * @example
   * private readonly logger = new Logger(TransactionsService.name);
   */
  private readonly logger: Logger = new Logger(TransactionsService.name);

  /**
   * Creates an instance of TransactionsService.
   *
   * @constructor
   * @param {Repository<Transaction>} transactionRepository - Repository for the Transaction entity.
   * @param {Repository<User>} userRepository - Repository for the User entity.
   * @param {QueryHelperService} queryHelperService - Service to build query options.
   */
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly queryHelperService: QueryHelperService
  ) {}

  /**
   * Creates a new transaction.
   *
   * @param {User} user - The user entity.
   * @param {number} total - The total amount of the transaction.
   * @param {PaymentResult} paymentResult - The payment result.
   * @returns {Promise<Transaction>} - The created transaction.
   *
   * @example
   * const transaction = await transactionsService.createTransaction(user, 100, paymentResult);
   */
  async createTransaction(
    user: User,
    total: number,
    paymentResult: PaymentResult
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      user,
      paymentId: Math.floor(Math.random() * 1000000),
      totalAmount: total,
      statusPayment: paymentResult.status
    });
    const savedTransaction = await this.transactionRepository.save(transaction);
    if (paymentResult.status === 'APPROVED') {
      await this.userRepository.update(user.userId, {
        transactionsCount: user.transactionsCount + 1,
        totalSpent: user.totalSpent + total
      });
    } else {
      await this.userRepository.update(user.userId, {
        transactionsCount: user.transactionsCount + 1
      });
    }

    return savedTransaction;
  }

  /**
   * Finds a transaction by reservation ID.
   *
   * @param {number} reservationId - ID of the reservation.
   * @returns {Promise<Transaction>} - The found transaction.
   *
   * @throws {NotFoundException} If the transaction is not found.
   *
   * @example
   * const transaction = await transactionsService.findTransactionByReservationId(1);
   */
  async findTransactionByReservationId(reservationId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { reservation: { reservationId } },
      relations: ['reservation']
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with reservation ID ${reservationId} not found.`);
    }

    return transaction;
  }

  /**
   * Retrieves all transactions for a user with pagination and filtering.
   *
   * @param {number} userId - ID of the user.
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filter data.
   * @returns {Promise<{ transactions: Transaction[]; total: number }>} - The filtered transactions and total count.
   *
   * @throws {InternalServerErrorException} If an error occurs while retrieving transactions.
   *
   * @example
   * const result = await transactionsService.findAll(1, paginationFilterDto);
   */
  async findAll(
    userId: number,
    paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const queryOptions = this.queryHelperService.buildQueryOptions<Transaction>(
      paginationFilterDto,
      5
    );

    queryOptions.where = { ...queryOptions.where, user: { userId } };
    queryOptions.relations = [
      'user',
      'reservation',
      'reservation.ticket',
      'reservation.reservationDetails',
      'reservation.reservationDetails.event'
    ];

    queryOptions.select = this.getSelectFieldsFindAll();
    if (paginationFilterDto.sortBy) {
      queryOptions.order = {
        [paginationFilterDto.sortBy]: paginationFilterDto.sortOrder.toUpperCase() // 'ASC' or 'DESC'
      };
    } else {
      queryOptions.order = {
        createdAt: 'DESC'
      };
    }
    try {
      const [transactions, total] = await this.transactionRepository.findAndCount(queryOptions);
      return { transactions, total };
    } catch (error) {
      this.logger.error(`Failed to retrieve transactions. Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve transactions.', error.message);
    }
  }

  /**
   * Calculates the total amount for the items in the cart.
   *
   * @param {CartItem[]} cartItems - List of cart items.
   * @returns {number} - The total amount.
   *
   * @example
   * const total = transactionsService.calculateCartTotal(cartItems);
   */
  calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Gets the fields to select for the findAll query.
   *
   * @returns {object} - The fields to select.
   *
   * @private
   *
   * @example
   * const selectFields = transactionsService.getSelectFieldsFindAll();
   */
  private getSelectFieldsFindAll(): object {
    return {
      transactionId: true,
      statusPayment: true,
      totalAmount: true,
      createdAt: true,
      user: {
        userId: true,
        firstName: true,
        lastName: true
      },
      reservation: {
        reservationId: true,
        transaction: {
          transactionId: true,
          statusPayment: true
        },
        ticket: {
          ticketId: true,
          purchaseKey: true,
          secureKey: true,
          qrCode: true
        },
        reservationDetails: {
          title: true,
          shortDescription: true,
          price: true,
          priceFormula: true,
          event: {
            eventId: true,
            categoryType: true,
            startDate: true
          }
        }
      }
    };
  }
}
