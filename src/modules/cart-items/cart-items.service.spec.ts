import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/events/event-prices.service';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { NotFoundException } from '@nestjs/common';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Cart } from '@modules/carts/entities/cart.entity';

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
            getOrCreateCart: jest.fn(),
            findCart: jest.fn()
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
        priceFormula: PriceFormulaEnum.SOLO,
        quantity: 2
      };
      const cart = { cartId: 1 } as Cart;
      const event = { eventId: 1, quantityAvailable: 5 } as Event;
      const cartItem = {} as CartItem;

      jest.spyOn(cartsService, 'getOrCreateCart').mockResolvedValue(cart);
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(50);
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(cartItemRepository, 'create').mockReturnValue(cartItem);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);

      const result = await service.addItemToCart(userId, createCartItemDto);
      expect(result).toBe(cartItem);
      expect(cartItemRepository.create).toHaveBeenCalledWith({
        ...createCartItemDto,
        price: 100,
        cart: { cartId: 1 },
        event: { eventId: 1 }
      });
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.addItemToCart(1, { eventId: 1, priceFormula: PriceFormulaEnum.SOLO, quantity: 1 })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if not enough tickets are available', async () => {
      const event = { eventId: 1, quantityAvailable: 2 } as Event;
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);
      await expect(
        service.addItemToCart(1, { eventId: 1, priceFormula: PriceFormulaEnum.SOLO, quantity: 3 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneItemInCart', () => {
    it('should find an item in the cart', async () => {
      const cartItem = {} as CartItem;
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(cartItem);
      const result = await service.findOneItemInCart(1, 1, 1);
      expect(result).toBe(cartItem);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOneItemInCart(1, 1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllItemsInCart', () => {
    it('should find all items in the cart', async () => {
      const cartItems = [{} as CartItem];
      jest.spyOn(cartItemRepository, 'find').mockResolvedValue(cartItems);
      const result = await service.findAllItemsInCart(1, 1);
      expect(result).toBe(cartItems);
    });
  });

  describe('updateQuantityInCart', () => {
    it('should update the quantity of an item in the cart', async () => {
      const cartItem = {
        cartItemId: 1,
        event: { eventId: 1, quantityAvailable: 10 } as Event,
        priceFormula: PriceFormulaEnum.SOLO,
        quantity: 2,
        price: 100
      } as CartItem;

      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(50);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(cartItem.event);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);

      const result = await service.updateQuantityInCart(1, 1, 1, 5);
      expect(result).toBe(cartItem);
      expect(cartItem.quantity).toBe(5);
      expect(cartItem.price).toBe(250);
      expect(cartItem.event.quantityAvailable).toBe(7);
    });

    it('should throw NotFoundException if the quantity is not available', async () => {
      const cartItem = {
        cartItemId: 1,
        event: { eventId: 1, quantityAvailable: 2 } as Event,
        priceFormula: PriceFormulaEnum.SOLO,
        quantity: 2,
        price: 100
      } as CartItem;
      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(50);

      await expect(service.updateQuantityInCart(1, 1, 1, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove an item from the cart', async () => {
      const cartItem = {} as CartItem;
      jest.spyOn(service, 'findOneItemInCart').mockResolvedValue(cartItem);
      jest.spyOn(cartItemRepository, 'remove').mockResolvedValue(cartItem);
      const result = await service.removeItemFromCart(1, 1, 1);
      expect(result).toBe(cartItem);
    });
  });

  describe('removeAllItemFromCart', () => {
    it('should remove all items from the cart', async () => {
      jest.spyOn(cartItemRepository, 'delete').mockResolvedValue({} as any);
      await service.removeAllItemFromCart(1, 1);
      expect(cartItemRepository.delete).toHaveBeenCalledWith({ cart: { cartId: 1 } });
    });
  });

  describe('save', () => {
    it('should save a cart item', async () => {
      const cartItem = {} as CartItem;
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);
      const result = await service.save(cartItem);
      expect(result).toBe(cartItem);
    });
  });
});
