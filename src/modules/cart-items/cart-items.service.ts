import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/events/event-prices.service';

/**
 * Service to manage cart items.
 * @class
 */
@Injectable()
export class CartItemsService {
  /**
   * Creates an instance of CartItemsService.
   *
   * @param {Repository<CartItem>} cartItemRepository - Repository for the CartItem entity.
   * @param {Repository<Event>} eventRepository - Repository for the Event entity.
   * @param {CartsService} cartsService - Service to manage shopping carts.
   * @param {EventPricesService} eventPricesService - Service to manage event prices.
   */
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly cartsService: CartsService,
    private readonly eventPricesService: EventPricesService
  ) {}

  /**
   * Adds an item to the cart.
   *
   * @param {number} userId - ID of the user.
   * @param {CreateCartItemDto} createCartItemDto - DTO containing cart item details.
   * @returns {Promise<CartItem>} - The added cart item.
   *
   * @throws {NotFoundException} If the event is not found or not enough tickets are available.
   *
   * @example
   * const cartItem = await cartItemsService.addItemToCart(1, createCartItemDto);
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
   * Gets or creates a cart item.
   *
   * @param {number} cartId - ID of the cart.
   * @param {CreateCartItemDto} createCartItemDto - DTO containing cart item details.
   * @param {number} unitPrice - Unit price of the item.
   * @returns {Promise<CartItem>} - The found or created cart item.
   *
   * @private
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
   * Finds a cart item by its ID.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @param {number} cartItemId - ID of the cart item.
   * @returns {Promise<CartItem>} - The found cart item.
   *
   * @throws {NotFoundException} If the cart item is not found.
   *
   * @example
   * const cartItem = await cartItemsService.findOneItemInCart(1, 1, 1);
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
   * Finds all items in a cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @returns {Promise<CartItem[]>} - The found cart items.
   *
   * @throws {NotFoundException} If no cart items are found.
   *
   * @example
   * const cartItems = await cartItemsService.findAllItemsInCart(1, 1);
   */
  async findAllItemsInCart(userId: number, cartId: number): Promise<CartItem[]> {
    await this.cartsService.findCart(userId, cartId);
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { cartId } },
      relations: ['event', 'cart']
    });
    if (!cartItems) {
      throw new NotFoundException('Cart items not found');
    }
    return cartItems;
  }

  /**
   * Updates the quantity of a cart item.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @param {number} cartItemId - ID of the cart item.
   * @param {number} quantity - The new quantity to set.
   * @returns {Promise<CartItem>} - The updated cart item.
   *
   * @throws {NotFoundException} If the cart item is not found or the quantity is not available.
   *
   * @example
   * const updatedItem = await cartItemsService.updateQuantityInCart(1, 1, 1, 5);
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
    cartItem.price = ticketPrice; // Recalculate the total price

    return await this.cartItemRepository.save(cartItem);
  }

  /**
   * Removes an item from the cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @param {number} cartItemId - ID of the cart item.
   * @returns {Promise<CartItem>} - The removed cart item.
   *
   * @throws {NotFoundException} If the cart item is not found.
   *
   * @example
   * const removedItem = await cartItemsService.removeOneItemFromCart(1, 1, 1);
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
   * Removes all items from a cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the cart.
   * @returns {Promise<void>}
   *
   * @example
   * await cartItemsService.removeAllItemFromCart(1, 1);
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
   * Saves a cart item to the repository.
   *
   * @param {CartItem} item - The cart item to save.
   * @returns {Promise<CartItem>} - The saved cart item.
   *
   * @example
   * const savedItem = await cartItemsService.save(cartItem);
   */
  async save(item: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(item);
  }
}
