import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SortOrder } from '@common/enums/sort-order.enum';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    mockUsersRepository = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated array of users with default parameters', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: null,
        sortOrder: SortOrder.ASC,
        filterBy: null,
        filterValue: null
      };
      const result = { users: [new User()], total: 1 };
      mockUsersRepository.findAndCount.mockResolvedValue([[new User()], 1]);

      const usersData = await service.findAll(paginationFilterDto);
      expect(usersData).toEqual(result);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: {},
        skip: 0,
        take: 10
      });
    });

    it('should handle filters and sorting', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 5,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.DESC,
        filterBy: 'email',
        filterValue: 'test@example.com'
      };
      const result = { users: [new User()], total: 1 };

      mockUsersRepository.findAndCount.mockResolvedValue([[new User()], 1]);
      const usersData = await service.findAll(paginationFilterDto);
      expect(usersData).toEqual(result);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 5
      });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      mockUsersRepository.findAndCount.mockRejectedValue(new Error('Database error'));
      await expect(service.findAll({} as PaginationAndFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = 1;
      const user = new User(); // Adjust with actual user entity properties if necessary
      mockUsersRepository.findOneBy.mockResolvedValue(user);
      expect(await service.findOne(userId)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyUserOneBy', () => {
    it('should return a user if found', async () => {
      const user = new User();
      mockUsersRepository.findOneBy.mockResolvedValue(user);
      const result = await service.verifyUserOneBy(1);
      expect(result).toEqual(user);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.verifyUserOneBy(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyUserOneRelation', () => {
    it('should return a user with relations if found', async () => {
      const user = new User();
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.verifyUserOneRelation(1, 'orders');
      expect(result).toEqual(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['orders']
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(undefined);
      await expect(service.verifyUserOneRelation(1, 'orders')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {}; // Adjust with actual dto properties if necessary
      const user = new User(); // Adjust with actual user entity properties if necessary

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockUsersRepository.merge.mockImplementation((user, dto) => ({ ...user, ...dto }));
      mockUsersRepository.save.mockResolvedValue(user);

      await expect(service.update(userId, updateUserDto)).resolves.toEqual(user);

      expect(mockUsersRepository.merge).toHaveBeenCalledWith(user, updateUserDto);

      expect(mockUsersRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.update(1, new UpdateUserDto())).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const user = new User(); // Adjust with actual user entity properties if necessary

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      await service.delete(userId);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
