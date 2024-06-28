import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtPayload } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenStrategy } from './access-token.strategy';
import { UserRole } from '@common/enums/user-role.enum';

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_ACCESS_TOKEN_SECRET') {
                return 'test-secret';
              }
            })
          }
        }
      ]
    }).compile();

    strategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('validate', () => {
    it('should return user if validation is successful', async () => {
      const payload: JwtPayload = { sub: 1, role: UserRole.USER, version: 1 };
      const user = new User();
      user.userId = 1;
      user.tokenVersion = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await strategy.validate(payload);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const payload: JwtPayload = { sub: 1, role: UserRole.USER, version: 1 };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token version does not match', async () => {
      const payload: JwtPayload = { sub: 1, role: UserRole.USER, version: 1 };
      const user = new User();
      user.userId = 1;
      user.tokenVersion = 2;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
