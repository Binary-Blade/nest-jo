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
   **/
  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { userId } },
      relations: ['cartItem']
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { userId } });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  /**
   * Finds a cart by its ID.
   *
   * @param cartId The ID of the cart to find.
   * @returns A promise resolved with the found cart.
   * @returns NotFoundException if the cart is not found.
   **/
  async verifyCartOneBy(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOneBy({ cartId });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }
    return cart;
  }

  /**
   * Finds a cart by its ID with the specified relations.
   *
   * @param cartId The ID of the cart to find.
   * @param relations The relations to include in the query.
   * @returns A promise resolved with the found cart.
   * @returns NotFoundException if the cart is not found.
   **/
  async verifyCartRelation(cartId: number, relations: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cartId },
      relations: [relations]
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }
    return cart;
  }

  /**
   * Saves a cart to the database.
   *
   * @param cart The cart to save.
   * @returns A promise resolved with the saved cart.
   **/
  async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }

  /**
   * Deletes a cart from the database.
   *
   * @param cartId The ID of the cart to delete.
   * @returns A promise resolved when the cart is deleted.
   * @returns NotFoundException if the cart is not found.
   **/
  async deleteCart(cartId: number): Promise<void> {
    const cart = await this.verifyCartOneBy(cartId);
    await this.cartRepository.remove(cart);
  }
}
