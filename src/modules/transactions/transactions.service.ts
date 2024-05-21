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
 * Service responsible for handling transactions.
 * This service is used to process transactions for a user's cart.
 */
@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  /**
   * Constructs the TransactionsService
   *
   * @param transactionRepository - The transaction repository
   * @param userRepository - The user repository
   */
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly queryHelperService: QueryHelperService
  ) {}

  /**
   * Create a transaction for a user's cart
   *
   * @param user - The user making the transaction
   * @param total - The total amount of the transaction
   * @param paymentResult - The result of the payment
   * @returns Promise<Transaction> - The created transaction
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
   * Find a transaction by reservation ID
   *
   * @param reservationId - The ID of the reservation to find the transaction for
   * @returns Promise<Transaction> - The transaction
   * @throws NotFoundException if the transaction is not found
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
    // Add sorting by date
    if (paginationFilterDto.sortBy) {
      queryOptions.order = {
        [paginationFilterDto.sortBy]: paginationFilterDto.sortOrder.toUpperCase() // 'ASC' or 'DESC'
      };
    } else {
      // Default sorting by createdAt date descending
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
   * Calculate the total price of a cart
   *
   * @private - This method is only used internally by the service
   * @param cartItems - The items in the cart
   * @returns number - The total price of the cart
   */
  calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private getSelectFieldsFindAll() {
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
