import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';

/**
 * Service responsible for handling cart items.
 */
@Injectable()
export class CartItemsService {
  // Inject the CartItem and Event repositories and the CartsService.
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly cartsService: CartsService
  ) {}

  // TODO: Add the necessary methods to handle cart items and prices.

  /**
   * Adds an item to the cart.
   *
   * @param userId The user ID.
   * @param createCartItemDto The cart item data.
   * @returns The created cart item.
   * @throws NotFoundException if the event does not exist.
   * @throws NotFoundException if the cart does not exist.
   */
  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    const event = await this.eventRepository.findOneBy({ eventId: createCartItemDto.eventId });
    if (!event) throw new NotFoundException('Event not found');

    if (createCartItemDto.quantity > event.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    event.quantityAvailable -= createCartItemDto.quantity;
    await this.eventRepository.save(event);

    return this.getOrCreateCartItem(cart.cartId, createCartItemDto);
  }

  /**
   * Finds a cart item in the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemId The cart item ID.
   * @returns The found cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws NotFoundException if the cart does not exist.
   */
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

  /**
   * Finds all items in the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @returns The found cart items.
   * @throws NotFoundException if the cart does not exist.
   * @throws NotFoundException if the cart items do not exist.
   */
  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    await this.cartsService.findCart(userId, cartId);
    return this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['event', 'cart']
    });
  }

  /**
   * Updates the quantity of an item in the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemId The cart item ID.
   * @param quantity The new quantity.
   * @returns The updated cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws NotFoundException if the cart does not exist.
   * @throws NotFoundException if the event does not exist.
   */
  async updateQuantityInCart(
    userId: number,
    cartId: number,
    cartItemId: number,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemId);
    const event = await this.eventRepository.findOneBy({
      eventId: cartItem.event.eventId
    });

    if (!event) throw new NotFoundException('Event not found');

    if (quantity > event.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    //TODO: Reduce the quantity of the event by the difference between the new quantity and the old quantity.
    event.quantityAvailable -= quantity - cartItem.quantity;
    await this.eventRepository.save(event);

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Removes an item from the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemId The cart item ID.
   * @returns The removed cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   */
  async removeItemFromCart(userId: number, cartId: number, cartItemId: number): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemId);
    await this.cartItemRepository.remove(cartItem);
    return cartItem;
  }

  /**
   * Removes all items from the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @returns The removed cart items.
   * @throws NotFoundException if the cart does not exist.
   * @throws NotFoundException if the cart items do not exist.
   */
  private async getOrCreateCartItem(
    cartId: number,
    createCartItemDto: CreateCartItemDto
  ): Promise<CartItem> {
    const eventExists = await this.eventRepository.findOneBy({
      eventId: createCartItemDto.eventId
    });
    if (!eventExists) throw new NotFoundException('Event not found');

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId }
      }
    });

    if (cartItem) {
      cartItem.quantity += createCartItemDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId }
      });
    }
    return this.cartItemRepository.save(cartItem);
  }
}
