import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { InternalServerErrorException } from '@nestjs/common';

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisClient = module.get<Redis>('REDIS_CLIENT');
  });

  describe('set', () => {
    it('should set a value in Redis without TTL', async () => {
      await service.set('testKey', 'testValue');
      expect(redisClient.set).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should set a value in Redis with TTL', async () => {
      await service.set('testKey', 'testValue', 3600);
      expect(redisClient.set).toHaveBeenCalledWith('testKey', 'testValue', 'EX', 3600);
    });

    it('should throw an error if no key is provided', async () => {
      await expect(service.set('', 'testValue')).rejects.toThrow('Key is required');
    });

    it('should set an object as a string', async () => {
      const obj = { foo: 'bar' };
      await service.set('testKey', obj);
      expect(redisClient.set).toHaveBeenCalledWith('testKey', JSON.stringify(obj));
    });
  });

  describe('get', () => {
    it('should get a value from Redis', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue('testValue');

      const result = await service.get('testKey');
      expect(result).toBe('testValue');
      expect(redisClient.get).toHaveBeenCalledWith('testKey');
    });

    it('should return null if the key does not exist', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue(null);

      const result = await service.get('testKey');
      expect(result).toBeNull();
    });

    it('should throw an error if no key is provided', async () => {
      await expect(service.get('')).rejects.toThrow('Key is required');
    });

    it('should throw an error if there is an error retrieving the key', async () => {
      jest.spyOn(redisClient, 'get').mockRejectedValue(new Error('Error'));

      await expect(service.get('testKey')).rejects.toThrow('Error');
    });
  });

  describe('del', () => {
    it('should delete a key from Redis', async () => {
      jest.spyOn(redisClient, 'del').mockResolvedValue(1);

      const result = await service.del('testKey');
      expect(result).toBe('Key deleted: testKey');
      expect(redisClient.del).toHaveBeenCalledWith('testKey');
    });

    it('should return a warning if the key does not exist', async () => {
      jest.spyOn(redisClient, 'del').mockResolvedValue(0);

      const result = await service.del('testKey');
      expect(result).toBe('Key not found: testKey');
    });

    it('should throw an error if no key is provided', async () => {
      await expect(service.del('')).rejects.toThrow('Key is required');
    });
  });

  describe('fetchCachedData', () => {
    it('should fetch data from cache if available', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(JSON.stringify({ foo: 'bar' }));

      const result = await service.fetchCachedData('testKey', () => Promise.resolve({}), 3600);
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should fetch data from function and cache it if not available in cache', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(null);
      jest.spyOn(service, 'set').mockResolvedValue('Success');

      const fetchFn = () => Promise.resolve({ foo: 'bar' });

      const result = await service.fetchCachedData('testKey', fetchFn, 3600);
      expect(result).toEqual({ foo: 'bar' });
      expect(service.set).toHaveBeenCalledWith('testKey', JSON.stringify({ foo: 'bar' }), 3600);
    });

    it('should throw an error if parsing fails', async () => {
      jest.spyOn(service, 'get').mockResolvedValue('not-json');

      await expect(
        service.fetchCachedData('testKey', () => Promise.resolve({}), 3600)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('safeParse', () => {
    it('should safely parse a JSON string', () => {
      const result = (service as any).safeParse('{"foo": "bar"}');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should throw an error if parsing fails', () => {
      expect(() => (service as any).safeParse('not-json')).toThrow(InternalServerErrorException);
    });
  });
});
