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
 * Service to manage JWT tokens and token-related operations.
 * @class
 */
@Injectable()
export class TokenService {
  /**
   * Logger instance from NestJS.
   *
   * @private
   * @readonly
   * @type {Logger}
   * @memberof TokenService
   * @default new Logger(TokenService.name)
   */
  private readonly logger: Logger = new Logger(TokenService.name);

  /**
   * Creates an instance of TokenService.
   *
   * @constructor
   * @param {UsersService} usersService - Service to manage users.
   * @param {TokenManagementService} tokenManagementService - Service to manage JWT tokens.
   * @param {CookieService} cookieService - Service to manage cookies.
   * @param {ConfigService} configService - Service to access configuration variables.
   * @param {RefreshTokenStoreService} refreshTokenStoreService - Service to manage refresh tokens.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenManagementService: TokenManagementService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
    private readonly refreshTokenStoreService: RefreshTokenStoreService
  ) {}

  /**
   * Generates access and refresh tokens for a user and stores the refresh token in Redis.
   *
   * @param {User} user - The user entity.
   * @returns {Promise<JWTTokens>} - The generated JWT tokens.
   *
   * @example
   * const tokens = await tokenService.getTokens(user);
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
   * Creates a payload for JWT tokens.
   *
   * @param {User} user - The user entity.
   * @returns {Payload} - The payload for the JWT token.
   *
   * @example
   * const payload = tokenService.createPayload(user);
   */
  private createPayload(user: User): Payload {
    return { sub: user.userId, role: user.role, version: user.tokenVersion };
  }

  /**
   * Refreshes the access and refresh tokens using the provided refresh token.
   *
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<Response>} - The response with new tokens.
   *
   * @example
   * const response = await tokenService.refreshToken(req, res);
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {
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
   * Generates a new access token using the provided refresh token.
   *
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<Response>} - The response with the new access token.
   *
   * @example
   * const response = await tokenService.generateAccessTokenFromRefreshToken(req, res);
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

  /**
   * Validates a refresh token and extracts the payload.
   *
   * @param {string} refreshToken - The refresh token to validate.
   * @returns {Promise<{ payload: Payload; userId: number }>} - The extracted payload and user ID.
   *
   * @throws {UnauthorizedException} If the token is invalid or expired.
   *
   * @example
   * const { payload, userId } = await tokenService.validateAndExtractFromRefreshToken(refreshToken);
   */
  async validateAndExtractFromRefreshToken(
    refreshToken: string
  ): Promise<{ payload: Payload; userId: number }> {
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

  /**
   * Sends an error response.
   *
   * @param {Response} res - HTTP response object.
   * @param {string} message - Error message.
   * @param {HttpStatus} status - HTTP status code.
   * @returns {Response} - The error response.
   *
   * @example
   * const response = tokenService.errorResponse(res, 'Error message', HttpStatus.BAD_REQUEST);
   */
  private errorResponse(res: Response, message: string, status: HttpStatus): Response {
    this.logger.error(message);
    return res.status(status).json({
      message: message,
      actionRequired: 'Please login again.'
    });
  }
}
