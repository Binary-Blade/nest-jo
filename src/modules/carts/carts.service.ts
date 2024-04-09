import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
/**
 * Service responsible for handling carts.
 */
@Injectable()
export class CartsService {
  // Inject the Cart repository.
  constructor(@InjectRepository(Cart) private readonly cartRepository: Repository<Cart>) {}

  /**
   * Finds a cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @returns The found cart.
   * @throws NotFoundException if the cart does not exist.
   **/
  async findCart(userId: number, cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cartId, user: { userId } }
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  /**
   * Gets or creates a cart for a user.
   *
   * @param userId The user ID.
   * @returns The cart.
   */
  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { userId } },
      relations: ['cartItems']
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { userId } });
      await this.cartRepository.save(cart);
    }
    return cart;
  }
}
