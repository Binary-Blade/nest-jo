import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cartitems.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

describe('CartItemsController', () => {
  let controller: CartItemsController;
  let service: CartItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemsController],
      providers: [
        {
          provide: CartItemsService,
          useValue: {
            addItemToCart: jest.fn(),
            findAllItemsInCart: jest.fn(),
            findOneItemInCart: jest.fn(),
            updateQuantityInCart: jest.fn(),
            removeOneItemFromCart: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<CartItemsController>(CartItemsController);
    service = module.get<CartItemsService>(CartItemsService);
  });

  describe('create', () => {
    it('should add an item to a cart successfully', async () => {
      const userId = 1;
      const createCartItemDto: CreateCartItemDto = {
        eventId: 1,
        quantity: 2,
        priceFormula: PriceFormulaEnum.SOLO,
        userId: 1
      };
      const cartItem = { cartItemId: 1 } as CartItem;

      jest.spyOn(service, 'addItemToCart').mockResolvedValue(cartItem);

      const result = await controller.create(userId, createCartItemDto);
      expect(result).toBe(cartItem);
      expect(service.addItemToCart).toHaveBeenCalledWith(userId, createCartItemDto);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(service, 'addItemToCart').mockRejectedValue(new NotFoundException());

      await expect(
        controller.create(1, {
          eventId: 1,
          quantity: 2,
          priceFormula: PriceFormulaEnum.SOLO,
          userId: 1
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if the user is not authorized to add items to the cart', async () => {
      jest.spyOn(service, 'addItemToCart').mockRejectedValue(new ForbiddenException());

      await expect(
        controller.create(1, {
          eventId: 1,
          quantity: 2,
          priceFormula: PriceFormulaEnum.SOLO,
          userId: 1
        })
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should fetch all items in a cart successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const cartItems = [{} as CartItem];

      jest.spyOn(service, 'findAllItemsInCart').mockResolvedValue(cartItems);

      const result = await controller.findAll(userId, `${cartId}`);
      expect(result).toBe(cartItems);
      expect(service.findAllItemsInCart).toHaveBeenCalledWith(userId, cartId);
    });

    it('should throw NotFoundException if the cart does not exist', async () => {
      jest.spyOn(service, 'findAllItemsInCart').mockRejectedValue(new NotFoundException());

      await expect(controller.findAll(1, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should fetch a specific item in a cart successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const cartItemId = 1;
      const cartItem = {} as CartItem;

      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);

      const result = await controller.findOne(userId, `${cartId}`, `${cartItemId}`);
      expect(result).toBe(cartItem);
      expect(service.findOneItemInCart).toHaveBeenCalledWith(userId, cartId, cartItemId);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      jest.spyOn(service, 'findOneItemInCart').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1, '1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if the user is not authorized to access the cart', async () => {
      jest.spyOn(service, 'findOneItemInCart').mockRejectedValue(new ForbiddenException());

      await expect(controller.findOne(1, '1', '1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update the quantity of an item in the cart successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const cartItemId = 1;
      const updateCartItemDto: UpdateCartItemDto = { quantity: 3 };
      const cartItem = {} as CartItem;

      jest.spyOn(service, 'updateQuantityInCart').mockResolvedValue(cartItem);

      const result = await controller.update(
        userId,
        `${cartId}`,
        `${cartItemId}`,
        updateCartItemDto
      );
      expect(result).toBe(cartItem);
      expect(service.updateQuantityInCart).toHaveBeenCalledWith(userId, cartId, cartItemId, 3);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      jest.spyOn(service, 'updateQuantityInCart').mockRejectedValue(new NotFoundException());

      await expect(controller.update(1, '1', '1', { quantity: 3 })).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if the user is not authorized to update the cart item', async () => {
      jest.spyOn(service, 'updateQuantityInCart').mockRejectedValue(new ForbiddenException());

      await expect(controller.update(1, '1', '1', { quantity: 3 })).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('remove', () => {
    it('should remove an item from a cart successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const cartItemId = 1;
      const cartItem = {} as CartItem;

      jest.spyOn(service, 'removeOneItemFromCart').mockResolvedValue(cartItem);

      const result = await controller.remove(userId, `${cartId}`, `${cartItemId}`);
      expect(result).toBe(cartItem);
      expect(service.removeOneItemFromCart).toHaveBeenCalledWith(userId, cartId, cartItemId);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      jest.spyOn(service, 'removeOneItemFromCart').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(1, '1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if the user is not authorized to remove items from the cart', async () => {
      jest.spyOn(service, 'removeOneItemFromCart').mockRejectedValue(new ForbiddenException());

      await expect(controller.remove(1, '1', '1')).rejects.toThrow(ForbiddenException);
    });
  });
});
