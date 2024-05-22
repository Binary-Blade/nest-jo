import { Payload } from '@common/interfaces/payload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Service to manage JWT tokens.
 * @class
 */
@Injectable()
export class TokenManagementService {
  /**
   * Creates an instance of TokenManagementService.
   *
   * @constructor
   * @param {JwtService} jwtService - Service to interact with JWT.
   * @param {ConfigService} configService - Service to access configuration variables.
   */
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * Creates an access token.
   *
   * @param {Payload} payload - The payload to encode in the token.
   * @returns {string} - The created access token.
   *
   * @example
   * const accessToken = tokenManagementService.createAccessToken({ userId: 1, role: 'user' });
   */
  createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION')
    });
  }

  /**
   * Creates a refresh token.
   *
   * @param {Payload} payload - The payload to encode in the token.
   * @returns {string} - The created refresh token.
   *
   * @example
   * const refreshToken = tokenManagementService.createRefreshToken({ userId: 1, role: 'user' });
   */
  createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    });
  }

  /**
   * Verifies a JWT token.
   *
   * @param {string} token - The token to verify.
   * @param {boolean} [isAccessToken=false] - Whether the token is an access token.
   * @returns {Promise<any>} - The decoded token payload.
   *
   * @example
   * const payload = await tokenManagementService.verifyToken(token, true);
   */
  verifyToken(token: string, isAccessToken: boolean = false): Promise<any> {
    const secretKey = isAccessToken
      ? this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
      : this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    return this.jwtService.verifyAsync(token, { secret: secretKey });
  }
}
