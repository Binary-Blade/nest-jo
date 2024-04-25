import { Payload } from '@common/interfaces/payload.interface';
import { RedisService } from '@database/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Service responsible for managing JWT tokens, including their creation and validation.
 * This service is used by the TokenService to create and validate JWT tokens.
 */
@Injectable()
export class TokenManagementService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {}

  /**
   * Creates a new access token for the given payload.
   * The token is signed with the access token secret and has an expiration time specified in the configuration.
   *
   * @param payload The payload for the token.
   * @returns The created access token.
   */
  createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION')
    });
  }

  /**
   * Creates a new refresh token for the given payload.
   * The token is signed with the refresh token secret and has an expiration time specified in the configuration.
   *
   * @param payload The payload for the token.
   * @returns The created refresh token.
   **/
  createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    });
  }

  /**
   * Verifies the given token and returns the decoded payload.
   * The token is verified using the access token secret.
   *
   *  @param token The token to verify.
   *  @param isAccessToken A flag indicating whether the token is an access token.
   *  @returns The decoded payload of the token.
   *  @throws An error if the token is invalid or has expired.
   **/
  verifyToken(token: string, isAccessToken: boolean = false): any {
    const secretKey = isAccessToken
      ? this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
      : this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    return this.jwtService.verifyAsync(token, { secret: secretKey });
  }

  /**
   * Removes the refresh token from Redis for the given user.
   *
   * @param userId The ID of the user for whom to remove the token.
   **/
  async refreshTokenRedisExist(userId: number, refreshToken: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === refreshToken;
  }
}
