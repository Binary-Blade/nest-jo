import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { SortOrder } from '@common/enums/sort-order.enum';
import { User } from './entities/user.entity';
import { UserRole } from '@common/enums/user-role.enum';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findAllValues: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            removeUserActive: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockUser: User = {
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
    accountKey: 'account key',
    isActive: true,
    role: UserRole.ADMIN,
    totalSpent: 0,
    transactionsCount: 0,
    tokenVersion: 0,
    createdAt: new Date(),
    lastLogin: new Date(),
    cart: null,
    reservations: [],
    transactions: []
  };

  describe('findAll', () => {
    it('should return all users with pagination and filtering', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
        filterBy: 'role',
        filterValue: 'admin'
      };
      const usersResult = { users: [mockUser], total: 1 };

      jest.spyOn(service, 'findAll').mockResolvedValue(usersResult);

      const result = await controller.findAll(paginationFilterDto);
      expect(result).toEqual(usersResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationFilterDto);
    });
  });

  describe('findAllValues', () => {
    it('should return all user values', async () => {
      const users = [mockUser];

      jest.spyOn(service, 'findAllValues').mockResolvedValue(users);

      const result = await controller.findAllValues();
      expect(result).toEqual(users);
      expect(service.findAllValues).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const userId = '1';

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(+userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(+userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated Name' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe('makeInactive', () => {
    it('should set user as inactive', async () => {
      const userId = '1';

      jest.spyOn(service, 'removeUserActive').mockResolvedValue(undefined);

      await controller.makeInactive(userId);
      expect(service.removeUserActive).toHaveBeenCalledWith(+userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';

      jest.spyOn(service, 'removeUserActive').mockRejectedValue(new NotFoundException());

      await expect(controller.makeInactive(userId)).rejects.toThrow(NotFoundException);
      expect(service.removeUserActive).toHaveBeenCalledWith(+userId);
    });
  });
});
