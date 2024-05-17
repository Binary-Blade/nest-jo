import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/events/event-prices.service';

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

  /**
   * Add an item to the cart.
   *
   * @param userId - The ID of the user adding the item to the cart
   * @param createCartItemDto - The item to add to the cart
   * @returns - The created cart item
   * @throws NotFoundException if the event does not exist
   * @throws NotFoundException if there are not enough tickets available
   */
  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    const event = await this.eventRepository.findOneBy({ eventId: createCartItemDto.eventId });
    if (!event) throw new NotFoundException('Event not found');

    if (createCartItemDto.quantity > event.quantityAvailable) {
      throw new NotFoundException('Not enough tickets available');
    }

    const priceDetail = event.prices.find(p => p.priceFormula === createCartItemDto.priceFormula);
    if (!priceDetail) {
      throw new NotFoundException('Price formula not found for event');
    }
    return this.getOrCreateCartItem(cart.cartId, createCartItemDto, priceDetail.price);
  }

  /**
   * Get or create a cart item. If the item already exists in the cart, update the quantity and price.
   * Otherwise, create a new cart item.
   *
   * @param cartId - The ID of the cart to add the item to
   * @param createCartItemDto - The item to add to the cart
   * @param ticketPrice - The price of the ticket
   * @returns - The created or updated cart item
   */
  private async getOrCreateCartItem(
    cartId: number,
    createCartItemDto: CreateCartItemDto,
    unitPrice: number
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
      existingCartItem.price = unitPrice;
      return await this.cartItemRepository.save(existingCartItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        price: unitPrice,
        cart: { cartId },
        event: { eventId: createCartItemDto.eventId }
      });
      return await this.cartItemRepository.save(cartItem);
    }
  }

  /**
   * Find a single item in the cart.
   *
   * @param userId - The ID of the user to find the cart item for
   * @param cartId - The ID of the cart to find the item in
   * @param cartItemId - The ID of the item to find
   * @returns - The requested cart item
   * @throws NotFoundException if the cart item does not exist in the cart
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
   * Find all items in the cart.
   *
   * @param userId - The ID of the user to find the cart items for
   * @param cartId - The ID of the cart to find the items in
   * @returns - A list of cart items
   */
  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    await this.cartsService.findCart(userId, cartId);
    const cartItems = this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['event', 'cart']
    });
    if (!cartItems) {
      throw new NotFoundException('Cart items not found');
    }
    return cartItems;
  }

  /**
   * Update the quantity of an item in the cart.
   *
   * @param userId - The ID of the user updating the cart item
   * @param cartId - The ID of the cart to update the item in
   * @param cartItemId - The ID of the item to update
   * @param quantity - The updated quantity
   * @returns - The updated cart item
   * @throws NotFoundException if the cart item does not exist in the cart
   * @throws NotFoundException if the quantity is not available
   */
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
    cartItem.quantity = quantity;
    cartItem.price = ticketPrice * quantity; // Recalculate the total price

    return await this.cartItemRepository.save(cartItem);
  }

  /**
   * Remove an item from the cart.
   *
   * @param userId - The ID of the user removing the item from the cart
   * @param cartId - The ID of the cart to remove the item from
   * @param cartItemId - The ID of the item to remove
   * @returns - The removed cart item
   */
  async removeOneItemFromCart(
    userId: number,
    cartId: number,
    cartItemId: number
  ): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemId);
    await this.cartItemRepository.remove(cartItem);
    return cartItem;
  }

  /**
   * Remove all items from the cart.
   *
   * @param userId - The ID of the user removing the items from the cart
   * @param cartId - The ID of the cart to remove the items from
   * @returns - The removed cart items
   */
  async removeAllItemFromCart(userId: number, cartId: number): Promise<void> {
    await this.cartsService.findCart(userId, cartId);
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['reservations']
    });
    await this.cartItemRepository.remove(cartItems);
  }

  /**
   * Save a cart item.
   *
   * @param item - The cart item to save
   * @returns - The saved cart item
   */
  async save(item: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(item);
  }
}
