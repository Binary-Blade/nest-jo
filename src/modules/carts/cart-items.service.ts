import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Offer } from '@modules/offers/entities/offer.entity';
import { CartsService } from './carts.service';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Offer) private readonly offerRepository: Repository<Offer>,
    private readonly cartsService: CartsService
  ) {}

  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    return this.getOrCreateCartItem(cart.cartId, createCartItemDto);
  }

  async findOneItemInCart(userId: number, cartId: number, cartItemsId: number): Promise<CartItem> {
    await this.cartsService.findCart(userId, cartId);
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cartItemsId,
        cart: { cartId }
      },
      relations: ['offer', 'cart']
    });
    if (!cartItem) {
      throw new NotFoundException(
        `CartItem with ID ${cartItemsId} not found in the specified cart.`
      );
    }
    return cartItem;
  }

  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    await this.cartsService.findCart(userId, cartId);
    return this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['offer', 'cart']
    });
  }

  async updateQuantityInCart(
    userId: number,
    cartId: number,
    cartItemsId: number,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);
    cartItem.quantity = quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async removeItemFromCart(userId: number, cartId: number, cartItemsId: number): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);
    await this.cartItemRepository.remove(cartItem);
    return cartItem;
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
