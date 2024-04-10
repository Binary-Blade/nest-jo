import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartitems.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Offer } from '@modules/offers/entities/offer.entity';
import { CartsService } from '@modules/carts/carts.service';

/**
 * Service responsible for handling cart items.
 */
@Injectable()
export class CartItemsService {
  // Inject the CartItem and Offer repositories and the CartsService.
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Offer) private readonly offerRepository: Repository<Offer>,
    private readonly cartsService: CartsService
  ) {}

  // TODO: Add the necessary methods to handle cart items and prices.

  /**
   * Adds an item to the cart.
   *
   * @param userId The user ID.
   * @param createCartItemDto The cart item data.
   * @returns The created cart item.
   * @throws NotFoundException if the offer does not exist.
   * @throws NotFoundException if the cart does not exist.
   */
  async addItemToCart(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartsService.getOrCreateCart(userId);
    const offer = await this.offerRepository.findOneBy({ offerId: createCartItemDto.offerId });
    if (!offer) throw new NotFoundException('Offer not found');

    if (createCartItemDto.quantity > offer.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    offer.quantityAvailable -= createCartItemDto.quantity;
    await this.offerRepository.save(offer);

    return this.getOrCreateCartItem(cart.cartId, createCartItemDto);
  }

  /**
   * Finds a cart item in the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemsId The cart item ID.
   * @returns The found cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws NotFoundException if the cart does not exist.
   */
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
      relations: ['offer', 'cart']
    });
  }

  /**
   * Updates the quantity of an item in the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemsId The cart item ID.
   * @param quantity The new quantity.
   * @returns The updated cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws NotFoundException if the cart does not exist.
   * @throws NotFoundException if the offer does not exist.
   */
  async updateQuantityInCart(
    userId: number,
    cartId: number,
    cartItemsId: number,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);
    const offer = await this.offerRepository.findOneBy({
      offerId: cartItem.offer.offerId
    });

    if (!offer) throw new NotFoundException('Offer not found');

    if (quantity > offer.quantityAvailable) {
      throw new NotFoundException('Quantity not available');
    }
    //TODO: Reduce the quantity of the offer by the difference between the new quantity and the old quantity.
    offer.quantityAvailable -= quantity - cartItem.quantity;
    await this.offerRepository.save(offer);

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Removes an item from the cart.
   *
   * @param userId The user ID.
   * @param cartId The cart ID.
   * @param cartItemsId The cart item ID.
   * @returns The removed cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   */
  async removeItemFromCart(userId: number, cartId: number, cartItemsId: number): Promise<CartItem> {
    const cartItem = await this.findOneItemInCart(userId, cartId, cartItemsId);
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
