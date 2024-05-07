import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
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

  /**
   * Fetch data from cache if available, otherwise fetch from the database
   *
   * @param key - The key to use for caching
   * @param fetchFn - Function to fetch data if not available in cache
   * @returns - The fetched data
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async fetchCachedData<T>(key: string, fetchFn: () => Promise<T>, TTL: number): Promise<T> {
    let data = await this.get(key);
    if (!data) {
      const result = await fetchFn();
      await this.set(key, JSON.stringify(result), TTL);
      return result;
    }
    return this.safeParse(data);
  }

  /**
   * Safely parse JSON data
   *
   * @private Helper method to parse JSON data
   * @param jsonString - The JSON string to parse
   * @returns - The parsed data
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  private safeParse<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      throw new InternalServerErrorException('Error parsing data');
    }
  }

  /**
   * Clear cache for a specific event or all events
   *
   * @param eventId - The ID of the event to clear cache for
   * @returns - Promise that resolves when the cache is cleared
   * @throws InternalServerErrorException if there is an error clearing the cache
   */
  async clearCacheEvent(eventId?: number): Promise<void> {
    if (eventId) {
      await this.del(`event_${eventId}`);
    }
    await this.del('events_all');
  }
}
