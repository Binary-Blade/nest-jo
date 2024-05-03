import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '@database/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@common/utils/utils.service';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Payload } from '@common/interfaces/payload.interface';
import { Request, Response } from 'express';
import { TokenManagementService } from './token-management.service';
import { UsersService } from '@modules/users/users.service';
import { CookieService } from '@security/cookie/cookie.service';

/**
 * Service responsible for managing JWT tokens, including their creation and validation.
 * This service utilizes the JwtService for signing tokens with specified secrets and expiration times.
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenManagementService: TokenManagementService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly utilsService: UtilsService
  ) {}

  /**
   * Generates a new access token and refresh token for the given user.
   * The refresh token is stored in Redis for later verification.
   *
   * @param user The user for whom to generate tokens.
   * @returns A promise resolved with the generated tokens.
   */
  async getTokens(user: User): Promise<JWTTokens> {
    const payload = this.createPayload(user);
    const accessToken = this.tokenManagementService.createAccessToken(payload);
    const refreshToken = this.tokenManagementService.createRefreshToken(payload);

    await this.storeRefreshTokenRedis(user.userId, refreshToken);

    this.logger.log(`Access token created for user ${user.userId}`);
    this.logger.log(`Refresh token created and stored in Redis for user ${user.userId}`);

    return { accessToken, refreshToken };
  }

  /**
   * Creates a payload object for the given user.
   * The payload contains the user's ID, role, and token version.
   *
   * @param user The user for whom to create the payload.
   * @returns The created payload.
   */
  private createPayload(user: User): Payload {
    return { sub: user.userId, role: user.role, version: user.tokenVersion };
  }

  /**
   * Stores the refresh token in Redis for the given user.
   * The token is stored with a TTL equal to the refresh token expiration time.
   *
   * @param userId The ID of the user for whom to store the token.
   * @param refreshToken The refresh token to store.
   */
  private async storeRefreshTokenRedis(userId: number, refreshToken: string): Promise<void> {
    const refreshTokenTTL = this.utilsService.convertDaysToSeconds(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    );
    await this.redisService.set(`refresh_token_${userId}`, refreshToken, refreshTokenTTL);
  }

  /**
   * Removes the refresh token from Redis for the given user.
   *
   * @param userId The ID of the user for whom to remove the token.
   **/

  private async refreshTokenRedisExist(userId: number, refreshToken: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === refreshToken;
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

  /**
   * Refreshes the access token and refresh token for the given user.
   * The old refresh token is verified and removed from Redis.
   * The new refresh token is stored in Redis and set as a cookie in the response.
   * The new access token is returned in the response.
   *
   * @param req The request object.
   * @param res The response object.
   * @returns A promise resolved with the new tokens and user ID.
   * @throws UnauthorizedException if the token cannot be refreshed.
   */

  async refreshToken(req: Request, res: Response): Promise<any> {
    const oldRefreshToken = this.cookieService.extractRefreshTokenCookie(req);
    try {
      const payload = await this.tokenManagementService.verifyToken(oldRefreshToken);
      const userId = payload.sub;

      const isTokenValid = await this.refreshTokenRedisExist(userId, oldRefreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      const user = await this.usersService.verifyUserOneBy(userId);
      await this.redisService.del(`refresh_token_${userId}`);

      const { accessToken, refreshToken } = await this.getTokens(user);
      const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');

      await this.storeRefreshTokenRedis(userId, refreshToken);
      this.cookieService.setRefreshTokenCookie(res, refreshToken);

      this.logger.log(`Tokens refreshed for user ${userId}`);
      return res.status(HttpStatus.OK).json({ accessToken, refreshToken, expiresIn, userId });
    } catch (error) {
      this.logger.error(`Token refresh error for user extracted from token: ${error.message}`);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          error.message || 'Internal server error. Please contact support if the problem persists.',
        actionRequired: 'Please login again.'
      });
    }
  }
}
