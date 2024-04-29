import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { UsersService } from '@modules/users/users.service';
import { TokenManagementService } from './token-management.service';
import { CookieService } from '@security/cookies/cookie.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@database/redis/redis.service';
import { UtilsService } from '@common/utils/utils.service';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '@modules/users/entities/user.entity';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';

const mockUser: User = {
  userId: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser',
  password: 'password',
  role: UserRole.USER,
  tokenVersion: 1
};

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

describe('TokenService', () => {
  let service: TokenService;
  let usersService: UsersService;
  let tokenManagementService: TokenManagementService;
  let cookieService: CookieService;
  let configService: ConfigService;
  let redisService: RedisService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: UsersService,
          useValue: {
            verifyUserOneBy: jest.fn().mockResolvedValue(mockUser)
          }
        },
        {
          provide: TokenManagementService,
          useValue: {
            createAccessToken: jest.fn().mockReturnValue('access-token'),
            createRefreshToken: jest.fn().mockReturnValue('refresh-token'),
            verifyToken: jest.fn().mockResolvedValue({ sub: mockUser.userId })
          }
        },
        {
          provide: CookieService,
          useValue: {
            extractRefreshTokenCookie: jest.fn().mockReturnValue('old-refresh-token'),
            setRefreshTokenCookie: jest.fn(),
            clearRefreshTokenCookie: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'JWT_REFRESH_TOKEN_EXPIRATION') return '14'; // days
              if (key === 'JWT_ACCESS_TOKEN_EXPIRATION') return '15m'; // minutes
            })
          }
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            del: jest.fn(),
            get: jest.fn()
          }
        },
        {
          provide: UtilsService,
          useValue: {
            convertDaysToSeconds: jest.fn().mockReturnValue(1209600) // 14 days
          }
        }
      ]
    }).compile();

    service = module.get<TokenService>(TokenService);
    usersService = module.get<UsersService>(UsersService);
    tokenManagementService = module.get<TokenManagementService>(TokenManagementService);
    cookieService = module.get<CookieService>(CookieService);
    configService = module.get<ConfigService>(ConfigService);
    redisService = module.get<RedisService>(RedisService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      const tokens = await service.getTokens(mockUser);

      expect(tokens).toEqual(mockTokens);
    });
  }

  describe('refreshTokens', () => {
    it('should refresh the tokens', async () => {
      const req = { cookies: { refreshToken } } as Request;
      const res = { clearCookie: jest.fn() } as unknown as Response;

      const result = await service.refreshTokens(req, res);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: '15m',
        userId: mockUser.userId
      });
    }

    it('should throw an error if the refresh token is invalid', async () => {
      const req = { cookies } as Request;
      const res = { clearCookie: jest.fn() } as unknown as Response;

      tokenManagementService.verifyToken.mockRejectedValue(new UnauthorizedException());

      await expect(service.refreshTokens(req, res)).rejects.toThrowError(UnauthorizedException);
    }

    it('should throw an error if the user is not found', async () => {
      const req = { cookies } as Request;
      const res = { clearCookie: jest.fn() } as unknown as Response;

      usersService.verifyUserOneBy.mockResolvedValue(undefined);

      await expect(service.refreshTokens(req, res)).rejects.toThrowError(UnauthorizedException);
    }

    it('should throw an error if the token cannot be refreshed', async () => {
      const req = { cookies } as Request;
      const res = { clearCookie: jest.fn() } as unknown as Response;

      tokenManagementService.verifyToken.mockRejectedValue(new Error());

      await expect(service.refreshTokens(req, res)).rejects.toThrowError(UnauthorizedException);
    }




  });
});
