import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';

/**
 * Service responsible for handling transactions.
 * This service is used to process transactions for a user's cart.
 */
@Injectable()
export class TransactionsService {
  /**
   * Constructs the TransactionsService
   *
   * @param transactionRepository - The transaction repository
   * @param userRepository - The user repository
   */
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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

  /**
   * Find all transactions
   *
   * @returns Promise<Transaction[]> - The transactions
   */
  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
}
