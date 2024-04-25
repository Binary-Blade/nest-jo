import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { TypeEvent } from '@common/enums/type-event.enum';

describe('CartItemsController', () => {
  let controller: CartItemsController;
  let service: CartItemsService;

  const mockCartItemsService = {
    addItemToCart: jest.fn(),
    findAllItemsInCart: jest.fn(),
    findOneItemInCart: jest.fn(),
    updateQuantityInCart: jest.fn(),
    removeItemFromCart: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemsController],
      providers: [
        {
          provide: CartItemsService,
          useValue: mockCartItemsService
        }
      ]
    }).compile();

    controller = module.get<CartItemsController>(CartItemsController);
    service = module.get<CartItemsService>(CartItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an item in the cart', async () => {
      const userId = 1;
      const dto: CreateCartItemDto = {
        quantity: 2,
        eventId: 123, // Assuming an example event ID
        ticketType: TypeEvent.DUO // Assuming a valid ticket type
      };
      const expectedCartItem = { ...dto, id: 1 };

      mockCartItemsService.addItemToCart.mockResolvedValue(expectedCartItem);

      const result = await controller.create(userId, dto);
      expect(service.addItemToCart).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(expectedCartItem);
    });
  });

  describe('findAll', () => {
    it('should retrieve all items in a specific cart', async () => {
      const userId = 1;
      const cartId = '1';
      const items = [{ id: 1, productId: 1, quantity: 2 }];
      mockCartItemsService.findAllItemsInCart.mockResolvedValue(items);

      const result = await controller.findAll(userId, cartId);
      expect(service.findAllItemsInCart).toHaveBeenCalledWith(userId, +cartId);
      expect(result).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should retrieve a specific item from a cart', async () => {
      const userId = 1;
      const cartId = '1';
      const cartItemId = '2';
      const item = { id: 2, productId: 3, quantity: 1 };
      mockCartItemsService.findOneItemInCart.mockResolvedValue(item);

      const result = await controller.findOne(userId, cartId, cartItemId);
      expect(service.findOneItemInCart).toHaveBeenCalledWith(userId, +cartId, +cartItemId);
      expect(result).toEqual(item);
    });
  });

  describe('update', () => {
    it('should update the quantity of a specific item in a cart', async () => {
      const userId = 1;
      const cartId = '1';
      const cartItemId = '2';
      const dto = { quantity: 5 };
      const updatedItem = { id: 2, productId: 3, quantity: 5 };
      mockCartItemsService.updateQuantityInCart.mockResolvedValue(updatedItem);

      const result = await controller.update(userId, cartId, cartItemId, dto);
      expect(service.updateQuantityInCart).toHaveBeenCalledWith(
        userId,
        +cartId,
        +cartItemId,
        dto.quantity
      );
      expect(result).toEqual(updatedItem);
    });
  });

  describe('remove', () => {
    it('should remove a specific item from a cart', async () => {
      const userId = 1;
      const cartId = '1';
      const cartItemId = '2';
      const expectedResponse = {}; // Adapt based on actual service behavior

      mockCartItemsService.removeItemFromCart.mockResolvedValue(expectedResponse);

      const result = await controller.remove(userId, cartId, cartItemId);
      expect(service.removeItemFromCart).toHaveBeenCalledWith(userId, +cartId, +cartItemId);
      expect(result).toEqual(expectedResponse); // This assumes your service actually returns something on delete
    });
  });
});
