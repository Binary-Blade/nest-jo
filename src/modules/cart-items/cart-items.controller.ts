import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserId } from '@common/decorators/user-id.decorator';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AccessTokenGuard } from '@security/guards';
import { CartItemsService } from './cart-items.service';

/**
 * Controller responsible for handling requests to the /carts route
 * This controller is used to manage cart items, including adding, updating, and removing items from a cart.
 */
@UseGuards(AccessTokenGuard)
@Controller('carts')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  /**
   * Adds an item to a cart.
   *
   * @param userId - The ID of the user adding the item to the cart.
   * @param createCartItemDto - The item to add to the cart.
   * @returns - The created cart item.
   * @throws NotFoundException if the event does not exist.
   * @throws ForbiddenException if the user is not authorized to add items to the cart.
   */
  @Post('/items')
  create(@UserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.addItemToCart(userId, createCartItemDto);
  }

  /**
   * Fetches all items in a cart.
   *
   * @param userId - The ID of the user to fetch the cart items for.
   * @param cartId - The ID of the cart to fetch the items from.
   * @returns - A list of cart items.
   * @throws NotFoundException if the cart does not exist.
   * @throws ForbiddenException if the user is not authorized to access the cart.
   */
  @Get(':cartId/items')
  findAll(@UserId() userId: number, @Param('cartId') cartId: string) {
    return this.cartItemsService.findAllItemsInCart(userId, +cartId);
  }

  /**
   * Fetches a specific item in a cart.
   *
   * @param userId - The ID of the user to fetch the cart item for.
   * @param cartId - The ID of the cart to fetch the item from.
   * @param cartItemId - The ID of the item to fetch.
   * @returns - The requested cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws ForbiddenException if the user is not authorized to access the cart.
   */
  @Get(':cartId/items/:cartItemId')
  findOne(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ) {
    return this.cartItemsService.findOneItemInCart(userId, +cartId, +cartItemId);
  }

  /**
   * Updates the quantity of an item in the cart.
   *
   * @param userId - The ID of the user updating the cart item.
   * @param cartId - The ID of the cart to update the item in.
   * @param cartItemId - The ID of the item to update.
   * @param updateCartItemDto - The updated quantity.
   * @returns - The updated cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws ForbiddenException if the user is not authorized to update the cart item.
   */
  @Patch(':cartId/items/:cartItemId')
  update(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartItemsService.updateQuantityInCart(
      userId,
      +cartId,
      +cartItemId,
      updateCartItemDto.quantity
    );
  }

  /**
   * Removes an item from a cart.
   *
   * @param userId - The ID of the user removing the item from the cart.
   * @param cartId - The ID of the cart to remove the item from.
   * @param cartItemId - The ID of the item to remove.
   * @returns - The removed cart item.
   * @throws NotFoundException if the cart item does not exist in the cart.
   * @throws ForbiddenException if the user is not authorized to remove items from the cart.
   */
  @Delete(':cartId/items/:cartItemId')
  remove(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ) {
    return this.cartItemsService.removeItemFromCart(userId, +cartId, +cartItemId);
  }
}
