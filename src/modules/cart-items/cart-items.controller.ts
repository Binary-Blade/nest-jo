import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserId } from '@common/decorators/user-id.decorator';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AccessTokenGuard } from '@security/guards';
import { CartItemsService } from './cart-items.service';
import { CartItem } from './entities/cartitems.entity';

/**
 * Controller to manage cart items.
 * @class
 */
@UseGuards(AccessTokenGuard)
@Controller('carts')
export class CartItemsController {
  /**
   * Creates an instance of CartItemsController.
   *
   * @param {CartItemsService} cartItemsService - Service to manage cart items.
   */
  constructor(private readonly cartItemsService: CartItemsService) {}

  /**
   * Adds an item to the cart.
   *
   * @param {number} userId - ID of the user.
   * @param {CreateCartItemDto} createCartItemDto - DTO containing cart item details.
   * @returns {Promise<CartItem>} - The added cart item.
   *
   * @example
   * POST /carts/items
   * {
   *   "eventId": 1,
   *   "priceFormula": "standard",
   *   "quantity": 2
   * }
   */
  @Post('/items')
  create(
    @UserId() userId: number,
    @Body() createCartItemDto: CreateCartItemDto
  ): Promise<CartItem> {
    return this.cartItemsService.addItemToCart(userId, createCartItemDto);
  }

  /**
   * Retrieves all items in a specific cart.
   *
   * @param {number} userId - ID of the user.
   * @param {string} cartId - ID of the cart.
   * @returns {Promise<CartItem[]>} - The cart items.
   *
   * @example
   * GET /carts/1/items
   */
  @Get(':cartId/items')
  findAll(@UserId() userId: number, @Param('cartId') cartId: string): Promise<CartItem[]> {
    return this.cartItemsService.findAllItemsInCart(userId, +cartId);
  }

  /**
   * Retrieves a specific item in a cart.
   *
   * @param {number} userId - ID of the user.
   * @param {string} cartId - ID of the cart.
   * @param {string} cartItemId - ID of the cart item.
   * @returns {Promise<CartItem>} - The cart item.
   *
   * @example
   * GET /carts/1/items/1
   */
  @Get(':cartId/items/:cartItemId')
  findOne(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ): Promise<CartItem> {
    return this.cartItemsService.findOneItemInCart(userId, +cartId, +cartItemId);
  }

  /**
   * Updates the quantity of a specific item in the cart.
   *
   * @param {number} userId - ID of the user.
   * @param {string} cartId - ID of the cart.
   * @param {string} cartItemId - ID of the cart item.
   * @param {UpdateCartItemDto} updateCartItemDto - DTO containing updated quantity.
   * @returns {Promise<CartItem>} - The updated cart item.
   *
   * @example
   * PATCH /carts/1/items/1
   * {
   *   "quantity": 3
   * }
   */
  @Patch(':cartId/items/:cartItemId')
  update(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ): Promise<CartItem> {
    return this.cartItemsService.updateQuantityInCart(
      userId,
      +cartId,
      +cartItemId,
      updateCartItemDto.quantity
    );
  }

  /**
   * Removes a specific item from the cart.
   *
   * @param {number} userId - ID of the user.
   * @param {string} cartId - ID of the cart.
   * @param {string} cartItemId - ID of the cart item.
   * @returns {Promise<CartItem>} - The removed cart item.
   *
   * @example
   * DELETE /carts/1/items/1
   */
  @Delete(':cartId/items/:cartItemId')
  remove(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ): Promise<CartItem> {
    return this.cartItemsService.removeOneItemFromCart(userId, +cartId, +cartItemId);
  }
}
