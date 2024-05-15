import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard, IsCreatorGuard, RoleGuard } from '@security/guards';
import { ForbiddenException } from '@nestjs/common';
import { PaginationAndFilterDto } from '@common/dto/pagination-filter.dto';

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
            remove: jest.fn()
          }
        },
        {
          provide: AccessTokenGuard,
          useValue: { canActivate: jest.fn(() => true) }
        },
        {
          provide: RoleGuard,
          useValue: { canActivate: jest.fn(() => true) }
        },
        {
          provide: IsCreatorGuard,
          useValue: { canActivate: jest.fn(() => true) }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users with pagination', async () => {
      const result = { users: [new User()], total: 1 };
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: null,
        sortOrder: null,
        filterBy: null,
        filterValue: null
      };
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll(paginationFilterDto)).toBe(result);
    });
  });

  describe('findAllValues', () => {
    it('should return all user values', async () => {
      const result: User[] = [];
      jest.spyOn(service, 'findAllValues').mockImplementation(async () => result);

      expect(await controller.findAllValues()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const result: User = new User();
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne('1')).toBe(result);
    });

    it('should enforce creator or admin guard', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      await expect(controller.findOne('1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const result: User = new User();
      const updateUserDto: UpdateUserDto = { firstName: 'UpdatedName' };
      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });

    it('should enforce creator or admin guard during update', async () => {
      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      await expect(controller.update('1', new UpdateUserDto())).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
    });

    it('should enforce creator or admin guard during removal', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      await expect(controller.remove('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
