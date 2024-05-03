import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CartsService', () => {
  let service: CartsService;
  let repository: Repository<Cart>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<CartsService>(CartsService);
    repository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCart', () => {
    it('should successfully create a cart', async () => {
      const userId = 1;
      const expectedCart = { userId, id: 1 };
      mockRepository.create.mockReturnValue(expectedCart);
      mockRepository.save.mockResolvedValue(expectedCart);

      const result = await service.getOrCreateCart(userId);
      expect(result).toEqual(expectedCart);
      expect(mockRepository.create).toHaveBeenCalledWith({ user: { userId } });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedCart);
    });
  });

  describe('findCart', () => {
    it('should return a cart if found', async () => {
      const cart = { id: 1, user: { userId: 1 } };
      mockRepository.findOne.mockResolvedValue(cart);

      const result = await service.findCart(1, 1);
      expect(result).toEqual(cart);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cartId: 1, user: { userId: 1 } }
      });
    });

    it('should throw a NotFoundException if the cart is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findCart(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrCreateCart', () => {
    it('should get an existing cart', async () => {
      const userId = 1;
      const cart = { id: 1, user: { userId } };
      mockRepository.findOne.mockResolvedValue(cart);

      const result = await service.getOrCreateCart(userId);
      expect(result).toEqual(cart);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: ['cartItem']
      });
    });

    it('should create a new cart if none exists', async () => {
      const userId = 1;
      const newCart = { user: { userId } };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newCart);
      mockRepository.save.mockResolvedValue(newCart);

      const result = await service.getOrCreateCart(userId);
      expect(result).toEqual(newCart);
      expect(mockRepository.create).toHaveBeenCalledWith({ user: { userId } });
      expect(mockRepository.save).toHaveBeenCalledWith(newCart);
    });
  });
});
