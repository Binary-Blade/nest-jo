import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

/**
 * Service to manage carts.
 * @class
 */
@Injectable()
export class CartsService {
  /**
   * Creates an instance of CartsService.
   *
   * @constructor
   * @param {Repository<Cart>} cartRepository - Repository for the Cart entity.
   */
  constructor(@InjectRepository(Cart) private readonly cartRepository: Repository<Cart>) {}

  /**
   * Finds a cart by user ID and cart ID.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @returns {Promise<Cart>} - The found cart.
   *
   * @throws {NotFoundException} If the cart is not found.
   *
   * @example
   * const cart = await cartsService.findCart(1, 1);
   */
  async findCart(userId: number, cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cartId, user: { userId } }
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  /**
   * Gets an existing cart or creates a new one if it doesn't exist.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<Cart>} - The found or newly created cart.
   *
   * @example
   * const cart = await cartsService.getOrCreateCart(1);
   */
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
   * Verifies a cart exists by its ID.
   *
   * @param {number} cartId - ID of the cart.
   * @returns {Promise<Cart>} - The verified cart.
   *
   * @throws {NotFoundException} If the cart is not found.
   *
   * @example
   * const cart = await cartsService.verifyCartOneBy(1);
   */
  async verifyCartOneBy(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOneBy({ cartId });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }
    return cart;
  }

  /**
   * Verifies a cart exists by its ID and loads specified relations.
   *
   * @param {number} cartId - ID of the cart.
   * @param {string} relations - Relations to load.
   * @returns {Promise<Cart>} - The verified cart with relations loaded.
   *
   * @throws {NotFoundException} If the cart is not found.
   *
   * @example
   * const cart = await cartsService.verifyCartRelation(1, 'cartItems');
   */
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
   * Saves a cart to the repository.
   *
   * @param {Cart} cart - The cart to save.
   * @returns {Promise<Cart>} - The saved cart.
   *
   * @example
   * const savedCart = await cartsService.save(cart);
   */
  async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }

  /**
   * Deletes a cart by its ID.
   *
   * @param {number} cartId - ID of the cart to delete.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the cart is not found.
   *
   * @example
   * await cartsService.deleteCart(1);
   */
  async deleteCart(cartId: number): Promise<void> {
    const cart = await this.verifyCartOneBy(cartId);
    await this.cartRepository.remove(cart);
  }
}
