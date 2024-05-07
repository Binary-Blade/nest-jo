import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>
  ) {}

  /**
   * Create a transaction for a user's cart
   *
   * @param user - The user making the transaction
   * @param total - The total amount of the transaction
   * @param paymentResult - The result of the payment
   * @returns - The created transaction
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
    return this.transactionRepository.save(transaction);
  }

  /**
   * Find a transaction by reservation ID
   *
   * @param reservationId - The ID of the reservation to find the transaction for
   * @returns - The transaction
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
   * @returns - The total price of the cart
   */
  calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  findAll() {
    return this.transactionRepository.find();
  }

  // TODO: Implement new methods here
}
