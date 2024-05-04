import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Payload } from '@common/interfaces/payload.interface';
import { Request, Response } from 'express';
import { TokenManagementService } from './token-management.service';
import { UsersService } from '@modules/users/users.service';
import { CookieService } from '@security/cookie/cookie.service';
import { RefreshTokenStoreService } from './refreshtoken-store.service';

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
    private readonly refreshTokenStoreService: RefreshTokenStoreService
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

    await this.refreshTokenStoreService.storeRefreshTokenInRedis(user.userId, refreshToken);

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
    if (!oldRefreshToken) {
      return this.errorResponse(
        res,
        'No refresh token provided. Please login again.',
        HttpStatus.UNAUTHORIZED
      );
    }
    try {
      const { userId } = await this.validateAndExtractFromRefreshToken(oldRefreshToken);
      const user = await this.usersService.verifyUserOneBy(userId);
      await this.refreshTokenStoreService.removeRefreshTokenRedis(userId);

      const { accessToken, refreshToken } = await this.getTokens(user);

      await this.refreshTokenStoreService.storeRefreshTokenInRedis(userId, refreshToken);
      this.cookieService.setRefreshTokenCookie(res, refreshToken);

      this.logger.log(`Tokens refreshed for user ${userId}`);
      return res.status(HttpStatus.OK).json({ accessToken, refreshToken, userId });
    } catch (error) {
      return this.errorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generates a new accessToken using a valid refreshToken from Redis.
   * This method ensures that the refreshToken is still valid and has not been tampered with.
   *
   * @param req The request object.
   * @param res The response object.
   * @returns A response with the new accessToken.
   */
  async generateAccessTokenFromRefreshToken(req: Request, res: Response): Promise<Response> {
    const refreshTokenFromCookie = this.cookieService.extractRefreshTokenCookie(req);
    if (!refreshTokenFromCookie) {
      return this.errorResponse(
        res,
        'No refresh token provided. Please login again.',
        HttpStatus.UNAUTHORIZED
      );
    }
    try {
      const { payload, userId } =
        await this.validateAndExtractFromRefreshToken(refreshTokenFromCookie);

      const newAccessToken = this.tokenManagementService.createAccessToken({
        sub: userId,
        role: payload.role,
        version: payload.version
      });

      return res.status(HttpStatus.OK).json({
        accessToken: newAccessToken,
        userId,
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION')
      });
    } catch (error) {
      return this.errorResponse(
        res,
        'Failed to generate access token due to internal error. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async validateAndExtractFromRefreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = await this.tokenManagementService.verifyToken(refreshToken);
      const userId = payload.sub;
      if (!(await this.refreshTokenStoreService.verifyRefreshTokenInRedis(userId, refreshToken))) {
        throw new UnauthorizedException('Invalid or expired refresh token.');
      }
      return { payload, userId };
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Failed to validate token.');
    }
  }

  private errorResponse(res: Response, message: string, status: HttpStatus): Response {
    this.logger.error(message);
    return res.status(status).json({
      message: message,
      actionRequired: 'Please login again.'
    });
  }
}
