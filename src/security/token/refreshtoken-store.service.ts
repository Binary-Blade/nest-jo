import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@database/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';

/**
 * Service to manage refresh tokens stored in Redis.
 * @class
 */
@Injectable()
export class RefreshTokenStoreService {
  /**
   * Logger instance from NestJS.
   *
   * @private
   * @readonly
   * @type {Logger}
   * @memberof RefreshTokenStoreService
   * @default new Logger(RefreshTokenStoreService.name)
   */
  private readonly logger: Logger = new Logger(RefreshTokenStoreService.name);

  /**
   * Creates an instance of RefreshTokenStoreService.
   *
   * @constructor
   * @param {RedisService} redisService - Service to interact with Redis.
   * @param {ConvertUtilsService} convertUtilsService - Service to convert values.
   * @param {ConfigService} configService - Service to access configuration variables.
   */
  constructor(
    private readonly redisService: RedisService,
    private readonly convertUtilsService: ConvertUtilsService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Stores a refresh token in Redis with a TTL.
   *
   * @param {number} userId - ID of the user.
   * @param {string} token - The refresh token.
   * @returns {Promise<void>}
   *
   * @example
   * await refreshTokenStoreService.storeRefreshTokenInRedis(1, 'refreshToken');
   */
  async storeRefreshTokenInRedis(userId: number, token: string): Promise<void> {
    const ttl = this.convertUtilsService.convertDaysToSeconds(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    );
    await this.redisService.set(`refresh_token_${userId}`, token, ttl);
    this.logger.log(`Refresh token stored for user ${userId}`);
  }

  /**
   * Verifies a refresh token in Redis.
   *
   * @param {number} userId - ID of the user.
   * @param {string} token - The refresh token to verify.
   * @returns {Promise<boolean>} - Whether the token is valid.
   *
   * @example
   * const isValid = await refreshTokenStoreService.verifyRefreshTokenInRedis(1, 'refreshToken');
   */
  async verifyRefreshTokenInRedis(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === token;
  }

  /**
   * Removes a refresh token from Redis.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<void>}
   *
   * @example
   * await refreshTokenStoreService.removeRefreshTokenRedis(1);
   */
  async removeRefreshTokenRedis(userId: number): Promise<void> {
    this.logger.log(`Refresh token for user ${userId} removed from Redis`);
    await this.redisService.del(`refresh_token_${userId}`);
  }
}
