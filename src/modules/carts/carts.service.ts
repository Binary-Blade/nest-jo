import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Offer } from '@modules/offers/entities/offer.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Offer) private readonly offerRepository: Repository<Offer>
  ) {}

  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.getOrCreateCart(userId);
    return this.getOrCreateCartItem(cart.cartId, createCartItemDto);
  }

  async findOneItemInCart(userId: number, cartId: number, cartItemsId: number): Promise<CartItem> {
    if (!cartItemsId) throw new NotFoundException('Item not found in cart');

    return this.cartItemRepository.findOne({
      where: {
        cartItemsId,
        cart: {
          cartId,
          user: { userId }
        }
      },
      relations: ['offer', 'cart']
    });
  }

  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    if (!cartId) throw new NotFoundException('Cart not found');

    return this.cartItemRepository.find({
      where: {
        cart: {
          cartId,
          user: { userId }
        }
      },
      relations: ['offer', 'cart']
    });
  }

  async updateQuantityInCart(
    userId: number,
    cartId: number,
    cartItemsId: number,
    quantity: number
  ): Promise<CartItem> {
    if (!cartItemsId) throw new NotFoundException('Item not found in cart');

    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);
    if (!cartItem) throw new NotFoundException('Item not found in cart');

    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async removeItemFromCart(userId: number, cartId: number, cartItemsId: number): Promise<CartItem> {
    if (!cartItemsId) throw new NotFoundException('Item not found in cart');
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);

    if (!cartItem) throw new NotFoundException('Item not found in cart');

    await this.cartItemRepository.remove(cartItem);
    return cartItem;
  }

  private async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: {
        user: { userId }
      },
      relations: ['cartItems']
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { userId } });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  private async getOrCreateCartItem(
    cartId: number,
    createCartItemDto: CreateCartItemDto
  ): Promise<CartItem> {
    const offerExists = await this.offerRepository.findOneBy({
      offerId: createCartItemDto.offerId
    });

    if (!offerExists) throw new NotFoundException('Offer not found');

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { cartId },
        offer: { offerId: createCartItemDto.offerId }
      }
    });

    if (cartItem) {
      cartItem.quantity += createCartItemDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        cart: { cartId },
        offer: { offerId: createCartItemDto.offerId }
      });
    }

    return this.cartItemRepository.save(cartItem);
  }
}
