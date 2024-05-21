import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepository: Repository<Cart>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
  });

  describe('findCart', () => {
    it('should find a cart successfully', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cart);

      const result = await service.findCart(1, 1);
      expect(result).toBe(cart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { cartId: 1, user: { userId: 1 } }
      });
    });

    it('should throw NotFoundException if the cart does not exist', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findCart(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrCreateCart', () => {
    it('should return an existing cart', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cart);

      const result = await service.getOrCreateCart(1);
      expect(result).toBe(cart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user: { userId: 1 } },
        relations: ['cartItem']
      });
    });

    it('should create a new cart if it does not exist', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(cartRepository, 'create').mockReturnValue(cart);
      jest.spyOn(cartRepository, 'save').mockResolvedValue(cart);

      const result = await service.getOrCreateCart(1);
      expect(result).toBe(cart);
      expect(cartRepository.create).toHaveBeenCalledWith({ user: { userId: 1 } });
      expect(cartRepository.save).toHaveBeenCalledWith(cart);
    });
  });

  describe('verifyCartOneBy', () => {
    it('should find a cart by ID', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'findOneBy').mockResolvedValue(cart);

      const result = await service.verifyCartOneBy(1);
      expect(result).toBe(cart);
      expect(cartRepository.findOneBy).toHaveBeenCalledWith({ cartId: 1 });
    });

    it('should throw NotFoundException if the cart does not exist', async () => {
      jest.spyOn(cartRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.verifyCartOneBy(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyCartRelation', () => {
    it('should find a cart by ID with specified relations', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(cart);

      const result = await service.verifyCartRelation(1, 'cartItem');
      expect(result).toBe(cart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { cartId: 1 },
        relations: ['cartItem']
      });
    });

    it('should throw NotFoundException if the cart does not exist', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

      await expect(service.verifyCartRelation(1, 'cartItem')).rejects.toThrow(NotFoundException);
    });
  });

  describe('save', () => {
    it('should save a cart successfully', async () => {
      const cart = {} as Cart;
      jest.spyOn(cartRepository, 'save').mockResolvedValue(cart);

      const result = await service.save(cart);
      expect(result).toBe(cart);
      expect(cartRepository.save).toHaveBeenCalledWith(cart);
    });
  });

  describe('deleteCart', () => {
    it('should delete a cart successfully', async () => {
      const cart = { cartId: 1 } as Cart;
      jest.spyOn(service, 'verifyCartOneBy').mockResolvedValue(cart);
      jest.spyOn(cartRepository, 'remove').mockResolvedValue(cart);

      await service.deleteCart(1);
      expect(service.verifyCartOneBy).toHaveBeenCalledWith(1);
      expect(cartRepository.remove).toHaveBeenCalledWith(cart);
    });

    it('should throw NotFoundException if the cart does not exist', async () => {
      jest.spyOn(service, 'verifyCartOneBy').mockRejectedValue(new NotFoundException());

      await expect(service.deleteCart(1)).rejects.toThrow(NotFoundException);
    });
  });
});
