import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto';
import { QueryHelperService } from '@database/query/query-helper.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let queryHelper: QueryHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: QueryHelperService,
          useValue: {
            buildQueryOptions: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    queryHelper = module.get<QueryHelperService>(QueryHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
      const users: User[] = [{ userId: 1 } as User];
      const total = 1;

      jest.spyOn(queryHelper, 'buildQueryOptions').mockReturnValue({});
      jest.spyOn(usersRepository, 'findAndCount').mockResolvedValue([users, total]);

      const result = await service.findAll(paginationFilterDto);

      expect(result).toEqual({ users, total });
      expect(queryHelper.buildQueryOptions).toHaveBeenCalledWith(paginationFilterDto);
      expect(usersRepository.findAndCount).toHaveBeenCalledWith({});
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(usersRepository, 'findAndCount').mockRejectedValue(new Error('Error'));

      await expect(service.findAll({} as PaginationAndFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAllValues', () => {
    it('should return all users', async () => {
      const users: User[] = [{ userId: 1 } as User];

      jest.spyOn(usersRepository, 'find').mockResolvedValue(users);

      const result = await service.findAllValues();

      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const user = { userId } as User;

      jest.spyOn(service, 'verifyUserOneBy').mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(service, 'verifyUserOneBy').mockRejectedValue(new NotFoundException());

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { firstName: 'Updated Name' };
      const user = { userId, firstName: 'Old Name' } as User;

      jest.spyOn(service, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({ ...user, ...updateUserDto });

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual({ ...user, ...updateUserDto });
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
      expect(usersRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateUserDto));
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { firstName: 'Updated Name' };

      jest.spyOn(service, 'verifyUserOneBy').mockRejectedValue(new NotFoundException());

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
    });
  });
  describe('removeUserActive', () => {
    it('should set user as inactive', async () => {
      const userId = 1;
      const user = { userId, isActive: true } as User;

      jest.spyOn(service, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({ ...user, isActive: false });

      await service.removeUserActive(userId);

      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, isActive: false });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(service, 'verifyUserOneBy').mockRejectedValue(new NotFoundException());

      await expect(service.removeUserActive(userId)).rejects.toThrow(NotFoundException);
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const user = { userId } as User;

      jest.spyOn(service, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'remove').mockResolvedValue(undefined);

      await service.delete(userId);

      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
      expect(usersRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(service, 'verifyUserOneBy').mockRejectedValue(new NotFoundException());

      await expect(service.delete(userId)).rejects.toThrow(NotFoundException);
      expect(service.verifyUserOneBy).toHaveBeenCalledWith(userId);
    });
  });

  describe('verifyUserOneBy', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const user = { userId } as User;

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      const result = await service.verifyUserOneBy(userId);

      expect(result).toEqual(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ userId });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.verifyUserOneBy(userId)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ userId });
    });
  });

  describe('verifyUserOneRelation', () => {
    it('should return a user by ID with specified relations', async () => {
      const userId = 1;
      const user = { userId } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await service.verifyUserOneRelation(userId, 'roles');

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['roles']
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.verifyUserOneRelation(userId, 'roles')).rejects.toThrow(
        NotFoundException
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['roles']
      });
    });
  });
});
