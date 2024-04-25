import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';
import { TypeEvent } from '@common/enums/type-event.enum';

// TODO: Improve the documentation
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

  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    const event = await this.eventRepository.findOneBy({ eventId: createCartItemDto.eventId });
    if (!event) throw new NotFoundException('Event not found');

    if (createCartItemDto.quantity > event.quantityAvailable) {
      throw new NotFoundException('Not enough tickets available');
    }

    const totalTicketPrice = this.calculateTotalTicketPrice(createCartItemDto, event);

    await this.eventRepository.save(event); // Save the event updates
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
        ticketType: createCartItemDto.ticketType
      },
      relations: ['cart', 'event']
    });

    if (existingCartItem) {
      existingCartItem.quantity += createCartItemDto.quantity;
      existingCartItem.price += ticketPrice;
    } else {
      const cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        price: ticketPrice,
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId }
      });
      return await this.cartItemRepository.save(cartItem);
    }

    return await this.cartItemRepository.save(existingCartItem);
  }

  private calculateTotalTicketPrice(createCartItemDto: CreateCartItemDto, event: Event): number {
    let ticketPrice = 0;
    switch (createCartItemDto.ticketType) {
      case TypeEvent.SOLO:
        ticketPrice = event.soloPrice;
        break;
      case TypeEvent.DUO:
        ticketPrice = event.duoPrice;
        break;
      case TypeEvent.FAMILY:
        ticketPrice = event.familyPrice;
        break;
    }
    return ticketPrice * createCartItemDto.quantity;
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
    const eventId = cartItem.event.eventId;
    if (!eventId) throw new NotFoundException('Event not found');

    if (quantity > event.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    // Update the available quantity in the event
    event.quantityAvailable -= quantity - cartItem.quantity;

    // Recalculate the total price for the new quantity and ticket type
    const createCartItemDto = {
      quantity: quantity,
      ticketType: cartItem.ticketType, // Assuming cartItem includes ticketType
      eventId: event.eventId // Assuming you have access to eventId here, else adjust accordingly
    };
    cartItem.price = this.calculateTotalTicketPrice(createCartItemDto, event);

    // Update the cart item quantity
    cartItem.quantity = quantity;

    // Save the updated event and cart item
    await this.eventRepository.save(event);
    return await this.cartItemRepository.save(cartItem);
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

  async save(item: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(item);
  }
}
