import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(@InjectRepository(Cart) private readonly cartRepository: Repository<Cart>) {}

  async findCart(userId: number, cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cartId, user: { userId } }
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

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
