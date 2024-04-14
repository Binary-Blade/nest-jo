import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserId } from '@common/decorators/user-id.decorator';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AccessTokenGuard } from '@security/guards';
import { CartItemsService } from './cart-items.service';

@UseGuards(AccessTokenGuard) // Use the access token and role guards
@Controller('carts')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  // Endpoint to add an item to the user's cart
  @Post('/items')
  create(@UserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.addItemToCart(userId, createCartItemDto);
  }

  // Endpoint to list all items in a specific cart
  // TODO: Ensure your front-end sends the correct cartId, and the user has the right to access this cart.
  @Get(':cartId/items')
  findAll(@UserId() userId: number, @Param('cartId') cartId: string) {
    return this.cartItemsService.findAllItemsInCart(userId, +cartId);
  }

  // Endpoint to find a specific item in a cart
  @Get(':cartId/items/:cartItemId')
  findOne(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ) {
    return this.cartItemsService.findOneItemInCart(userId, +cartId, +cartItemId);
  }

  // Endpoint to update the quantity of a specific item in a cart
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

  // Endpoint to remove a specific item from a cart
  @Delete(':cartId/items/:cartItemId')
  remove(
    @UserId() userId: number,
    @Param('cartId') cartId: string,
    @Param('cartItemId') cartItemId: string
  ) {
    return this.cartItemsService.removeItemFromCart(userId, +cartId, +cartItemId);
  }
}
