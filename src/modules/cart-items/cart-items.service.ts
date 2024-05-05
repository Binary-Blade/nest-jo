import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/event-prices/event-prices.service';

// TODO: Improve the documentation
/**
 * Service responsible for handling cart items.
 * This service is used to add, update, and remove items from the cart.
 */
@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly cartsService: CartsService,
    private readonly eventPricesService: EventPricesService
  ) {}

  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    const event = await this.eventRepository.findOneBy({ eventId: createCartItemDto.eventId });
    if (!event) throw new NotFoundException('Event not found');

    if (createCartItemDto.quantity > event.quantityAvailable) {
      throw new NotFoundException('Not enough tickets available');
    }

    const ticketPrice = await this.eventPricesService.getPriceByEventAndType(
      createCartItemDto.eventId,
      createCartItemDto.priceFormula
    );
    const totalTicketPrice = ticketPrice * createCartItemDto.quantity;
    return this.getOrCreateCartItem(cart.cartId, createCartItemDto, totalTicketPrice);
  }

  private async getOrCreateCartItem(
    cartId: number,
    createCartItemDto: CreateCartItemDto,
    ticketPrice: number
  ): Promise<CartItem> {
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId },
        priceFormula: createCartItemDto.priceFormula
      },
      relations: ['cart', 'event']
    });

    if (existingCartItem) {
      existingCartItem.quantity += createCartItemDto.quantity;
      existingCartItem.price += ticketPrice * createCartItemDto.quantity; // Update total price
      return await this.cartItemRepository.save(existingCartItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        price: ticketPrice,
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId }
      });
      return await this.cartItemRepository.save(cartItem);
    }
  }

  async findOneItemInCart(userId: number, cartId: number, cartItemId: number): Promise<CartItem> {
    await this.cartsService.findCart(userId, cartId);
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cartItemId,
        cart: { cartId }
      },
      relations: ['event', 'cart']
    });
    if (!cartItem) {
      throw new NotFoundException(
        `CartItem with ID ${cartItemId} not found in the specified cart.`
      );
    }
    return cartItem;
  }

  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    await this.cartsService.findCart(userId, cartId);
    return this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['event', 'cart']
    });
  }

  async updateQuantityInCart(
    userId: number,
    cartId: number,
    cartItemId: number,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemId);
    if (!cartItem) throw new NotFoundException('Cart item not found');

    const ticketPrice = await this.eventPricesService.getPriceByEventAndType(
      cartItem.event.eventId,
      cartItem.priceFormula
    );
    if (quantity > cartItem.event.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    cartItem.event.quantityAvailable -= quantity - cartItem.quantity;
    cartItem.quantity = quantity;
    cartItem.price = ticketPrice * quantity; // Recalculate the total price

    await this.eventRepository.save(cartItem.event);
    return await this.cartItemRepository.save(cartItem);
  }

  async removeItemFromCart(userId: number, cartId: number, cartItemId: number): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemId);
    await this.cartItemRepository.remove(cartItem);
    return cartItem;
  }

  async save(item: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(item);
  }
}
