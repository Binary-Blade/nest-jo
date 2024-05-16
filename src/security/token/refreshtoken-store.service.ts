import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@database/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';

/**
 * Service responsible for storing and verifying refresh tokens in Redis.
 * The service provides methods for storing, verifying, and removing refresh tokens.
 */

@Injectable()
export class RefreshTokenStoreService {
  private readonly logger = new Logger(RefreshTokenStoreService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly convertUtilsService: ConvertUtilsService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Stores the refresh token in Redis for the given user.
   *
   * @param userId The ID of the user for whom to store the token.
   * @param token The refresh token to store.
   * @returns A promise resolved when the token is stored.
   * @throws An error if the token expiration time is not set in the configuration.
   */
  async storeRefreshTokenInRedis(userId: number, token: string): Promise<void> {
    const ttl = this.convertUtilsService.convertDaysToSeconds(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    );
    await this.redisService.set(`refresh_token_${userId}`, token, ttl);
    this.logger.log(`Refresh token stored for user ${userId}`);
  }

  /**
   * Verifies the refresh token in Redis for the given user.
   *
   * @param userId The ID of the user for whom to verify the token.
   * @param token The refresh token to verify.
   * @returns A promise resolved with a boolean indicating whether the token is valid.
   * @throws An error if the token is not found in Redis.
   */
  async verifyRefreshTokenInRedis(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === token;
  }

  /**
   * Removes the refresh token from Redis for the given user.
   * This method is called when the user logs out or refreshes their token.
   *
   * @param userId The ID of the user for whom to remove the token.
   * @returns A promise resolved when the token is removed.
   */
  async removeRefreshTokenRedis(userId: number) {
    this.logger.log(`Refresh token for user ${userId} removed from Redis`);
    await this.redisService.del(`refresh_token_${userId}`);
  }
}
