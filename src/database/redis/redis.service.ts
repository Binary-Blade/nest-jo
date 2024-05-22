import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Service to interact with Redis for caching purposes.
 * @class
 */
@Injectable()
export class RedisService {
  /**
   * Logger instance from NestJS.
   *
   * @private
   * @readonly
   * @type {Logger}
   * @memberof RedisService
   * @default new Logger(RedisService.name)
   */
  private readonly logger: Logger = new Logger(RedisService.name);

  /**
   * @param {Redis} redisClient - The Redis client instance injected via dependency injection.
   */
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Set a key-value pair in Redis with optional TTL (Time To Live).
   *
   * @param {string} key - The key to set in Redis.
   * @param {any} value - The value to set, will be stringified if not a string.
   * @param {number} [ttl] - Optional TTL in seconds.
   * @returns {Promise<string>} - Confirmation message after setting the key.
   *
   * @throws {Error} If the key is not provided.
   *
   * @example
   * await redisService.set('user:1', { name: 'John' }, 3600);
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
   * Get a value from Redis by key.
   *
   * @param {string} key - The key to retrieve from Redis.
   * @returns {Promise<string | null>} - The value associated with the key, or null if not found.
   *
   * @throws {Error} If the key is not provided.
   *
   * @example
   * const value = await redisService.get('user:1');
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
   * Delete a key from Redis.
   *
   * @param {string} key - The key to delete from Redis.
   * @returns {Promise<string>} - Confirmation message after deleting the key.
   *
   * @throws {Error} If the key is not provided.
   *
   * @example
   * await redisService.del('user:1');
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
   * Fetch data from Redis cache or execute a function to retrieve data and cache it.
   *
   * @param {string} key - The key to fetch from cache.
   * @param {() => Promise<T>} fetchFn - The function to execute if data is not found in cache.
   * @param {number} TTL - Time To Live for the cached data in seconds.
   * @returns {Promise<T>} - The fetched or cached data.
   *
   * @template T
   *
   * @example
   * const data = await redisService.fetchCachedData('user:1', fetchUserFromDb, 3600);
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
   * Safely parse a JSON string.
   *
   * @param {string} jsonString - The JSON string to parse.
   * @returns {T} - The parsed object.
   *
   * @throws {InternalServerErrorException} If parsing fails.
   *
   * @template T
   */
  private safeParse<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      throw new InternalServerErrorException('Error parsing data');
    }
  }

  /**
   * Clear cache for a specific event or all events.
   *
   * @param {number} [eventId] - Optional event ID to clear specific cache.
   * @returns {Promise<void>}
   *
   * @example
   * await redisService.clearCacheEvent(123);
   * await redisService.clearCacheEvent();
   */
  async clearCacheEvent(eventId?: number): Promise<void> {
    if (eventId) {
      await this.del(`event_${eventId}`);
    }
    await this.del('events_all');
  }
}
