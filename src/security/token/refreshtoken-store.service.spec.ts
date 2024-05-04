import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenStoreService } from './refreshtoken-store.service';
import { RedisService } from '@database/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@common/utils/utils.service';
import { Logger } from '@nestjs/common';

describe('RefreshTokenStoreService', () => {
  let service: RefreshTokenStoreService;
  let redisService: RedisService;
  let utilsService: UtilsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStoreService,
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: UtilsService,
          useValue: {
            convertDaysToSeconds: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<RefreshTokenStoreService>(RefreshTokenStoreService);
    redisService = module.get<RedisService>(RedisService);
    utilsService = module.get<UtilsService>(UtilsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('storeRefreshTokenInRedis', () => {
    it('should store the refresh token in Redis', async () => {
      const userId = 1;
      const token = 'testToken';
      const ttl = 86400; // 1 day in seconds
      jest.spyOn(configService, 'get').mockReturnValue('1d');
      jest.spyOn(utilsService, 'convertDaysToSeconds').mockReturnValue(ttl);

      await service.storeRefreshTokenInRedis(userId, token);

      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_TOKEN_EXPIRATION');
      expect(utilsService.convertDaysToSeconds).toHaveBeenCalledWith('1d');
      expect(redisService.set).toHaveBeenCalledWith(`refresh_token_${userId}`, token, ttl);
    });
  });

  describe('verifyRefreshTokenInRedis', () => {
    it('should verify the refresh token in Redis', async () => {
      const userId = 1;
      const token = 'testToken';

      jest.spyOn(redisService, 'get').mockResolvedValue(token);

      const result = await service.verifyRefreshTokenInRedis(userId, token);
      expect(redisService.get).toHaveBeenCalledWith(`refresh_token_${userId}`);
      expect(result).toBe(true);
    });

    it('should return false when the refresh token does not match', async () => {
      const userId = 1;
      const token = 'testToken';

      jest.spyOn(redisService, 'get').mockResolvedValue('differentToken');

      const result = await service.verifyRefreshTokenInRedis(userId, token);
      expect(redisService.get).toHaveBeenCalledWith(`refresh_token_${userId}`);
      expect(result).toBe(false);
    });
  });

  describe('removeRefreshTokenRedis', () => {
    it('should remove the refresh token from Redis', async () => {
      const userId = 1;

      await service.removeRefreshTokenRedis(userId);

      expect(redisService.del).toHaveBeenCalledWith(`refresh_token_${userId}`);
    });
  });
});
