import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Redis service for interacting with Redis cache
 *
 * @class RedisService class (provider) for interacting with Redis cache
 * @method set Set data in Redis cache
 * @method get Get data from Redis cache
 * @method del Delete data from Redis cache
 * @method setMultiple Set multiple key-value pairs in Redis cache
 * @method formatKey Format key with prefix
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  /**
   * Constructor for RedisService class
   *
   * @param redisClient Redis client
   * @param configService ConfigService instance
   */
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Set data in Redis cache
   *
   * @param key Key to set data against
   * @param value Value to set
   * @param ttl Time to live for the key
   * @returns Success message
   */
  async set(key: string, value: any, ttl?: number): Promise<string> {
    if (!key) throw new Error('Key is required');
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (typeof ttl === 'number') {
      await this.redisClient.set(key, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringValue);
    }
    return `Data set for key: ${key}`;
  }

  /**
   * Get data from Redis cache
   *
   * @param key Key to get data for
   * @returns Value for the key
   */
  async get(key: string): Promise<string | null> {
    if (!key) throw new Error('Key is required');

    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      return value;
    } catch (error) {
      this.logger.error(`Error retrieving key ${key} from cache`, error);
      throw error;
    }
  }

  /**
   * Get data from Redis cache
   *
   * @param key Key to get data for
   * @returns Value for the key
   */
  async del(key: string): Promise<string> {
    if (!key) throw new Error('Key is required');

    const result = await this.redisClient.del(key);
    if (!result) {
      this.logger.warn(`Key not found in cache: ${key}`);
      return `Key not found: ${key}`;
    }
    return `Key deleted: ${key}`;
  }

  // /**
  //  * Set multiple key-value pairs in Redis cache
  //  *
  //  * @param keyValuePairs Key-value pairs to set
  //  * @param ttl Time to live for the keys
  //  * @returns Success message
  //  */
  // async setMultiple(keyValuePairs: KeyValuePairs, ttl?: number): Promise<void> {
  //   const pipeline = this.redisClient.pipeline();
  //   keyValuePairs.forEach(([key, value]) => {
  //     const fullKey = this.formatKey(key);
  //     const stringValue = JSON.stringify(value);
  //     if (typeof ttl === 'number') {
  //       pipeline.set(fullKey, stringValue, 'EX', ttl);
  //     } else {
  //       pipeline.set(fullKey, stringValue);
  //     }
  //   });
  //   await pipeline.exec();
  // }
}
