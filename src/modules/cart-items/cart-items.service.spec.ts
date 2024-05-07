import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { CartItem } from './entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/events/event-prices.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

describe('CartItemsService', () => {
  let service: CartItemsService;
  let cartItemRepository: Repository<CartItem>;
  let eventRepository: Repository<Event>;
  let cartsService: CartsService;
  let eventPricesService: EventPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemsService,
        {
          provide: getRepositoryToken(CartItem),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Event),
          useClass: Repository
        },
        {
          provide: CartsService,
          useValue: {
            findCart: jest.fn(),
            getOrCreateCart: jest.fn()
          }
        },
        {
          provide: EventPricesService,
          useValue: {
            getPriceByEventAndType: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    cartsService = module.get<CartsService>(CartsService);
    eventPricesService = module.get<EventPricesService>(EventPricesService);
  });

  describe('addItemToCart', () => {
    it('should add an item to the cart', async () => {
      const userId = 1;
      const createCartItemDto: CreateCartItemDto = {
        eventId: 1,
        quantity: 2,
        priceFormula: PriceFormulaEnum.SOLO
      };
      const cart = {
        cartId: 1,
        user: {} as any,
        cartItem: [] as any,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event = { eventId: 1, quantityAvailable: 10 } as Event;
      const unitPrice = 100;
      const cartItem = { cartItemId: 1 } as CartItem;

      jest.spyOn(cartsService, 'getOrCreateCart').mockResolvedValue(cart);
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(unitPrice);
      jest.spyOn(service as any, 'getOrCreateCartItem').mockResolvedValue(cartItem);

      const result = await service.addItemToCart(userId, createCartItemDto);
      expect(result).toBe(cartItem);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.addItemToCart(1, { eventId: 1, quantity: 2, priceFormula: PriceFormulaEnum.SOLO })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if not enough tickets are available', async () => {
      const event = { eventId: 1, quantityAvailable: 1 } as Event;
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);

      await expect(
        service.addItemToCart(1, { eventId: 1, quantity: 2, priceFormula: PriceFormulaEnum.SOLO })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneItemInCart', () => {
    it('should return a single cart item', async () => {
      const cartItem = { cartItemId: 1 } as CartItem;
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(cartItem);

      const result = await service.findOneItemInCart(1, 1, 1);
      expect(result).toBe(cartItem);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneItemInCart(1, 1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateQuantityInCart', () => {
    it('should update the quantity of an item in the cart', async () => {
      const cartItem = {
        cartItemId: 1,
        event: { eventId: 1, quantityAvailable: 10 } as Event,
        priceFormula: 'SOLO',
        quantity: 1,
        price: 100
      } as CartItem;
      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(100);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);

      const result = await service.updateQuantityInCart(1, 1, 1, 2);
      expect(result).toBe(cartItem);
      expect(cartItem.price).toBe(200);
      expect(cartItem.quantity).toBe(2);
    });

    it('should throw NotFoundException if the quantity is not available', async () => {
      const cartItem = {
        cartItemId: 1,
        event: { eventId: 1, quantityAvailable: 1 } as Event,
        priceFormula: 'SOLO',
        quantity: 1,
        price: 100
      } as CartItem;
      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(100);

      await expect(service.updateQuantityInCart(1, 1, 1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOneItemFromCart', () => {
    it('should remove a cart item', async () => {
      const cartItem = { cartItemId: 1 } as CartItem;
      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(cartItemRepository, 'remove').mockResolvedValue(cartItem);

      const result = await service.removeOneItemFromCart(1, 1, 1);
      expect(result).toBe(cartItem);
    });
  });

  describe('removeAllItemFromCart', () => {
    it('should remove all cart items', async () => {
      jest.spyOn(cartItemRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.removeAllItemFromCart(1, 1)).resolves.not.toThrow();
    });
  });

  describe('save', () => {
    it('should save a cart item', async () => {
      const cartItem = { cartItemId: 1 } as CartItem;
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);

      const result = await service.save(cartItem);
      expect(result).toBe(cartItem);
    });
  });
});
