import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PROD_ENV } from '@utils/constants/constants.env';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';
import { CookieOptions, Request, Response } from 'express';

/**
 * Service to manage cookies.
 * @class
 */
@Injectable()
export class CookieService {
  constructor(
    private configService: ConfigService,
    private convertUtilsService: ConvertUtilsService
  ) {}

  /**
   * Extracts the refresh token from the request cookies.
   *
   * @param {Request} req - HTTP request object.
   * @returns {string} - The refresh token.
   *
   * @example
   * const refreshToken = cookieService.extractRefreshTokenCookie(req);
   */
  extractRefreshTokenCookie(req: Request): string {
    return req.cookies['RefreshToken'];
  }

  /**
   * Sets the refresh token as an HTTP-only cookie.
   *
   * @param {Response} res - HTTP response object.
   * @param {string} refreshToken - The refresh token.
   * @throws {Error} If JWT_REFRESH_TOKEN_EXPIRATION is not configured.
   *
   * @example
   * cookieService.setRefreshTokenCookie(res, refreshToken);
   */
  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const refreshTokenExpiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');
    if (!refreshTokenExpiration) {
      throw new Error('JWT_REFRESH_TOKEN_EXPIRATION is not configured.');
    }

    const refreshTokenTTL = this.convertUtilsService.convertDaysToSeconds(refreshTokenExpiration);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === PROD_ENV,
      maxAge: refreshTokenTTL * 1000,
      path: '/',
      sameSite: this.configService.get('NODE_ENV') === PROD_ENV ? 'none' : 'strict'
    };
    res.cookie('RefreshToken', refreshToken, cookieOptions);
  }

  /**
   * Clears the refresh token cookie.
   *
   * @param {Response} res - HTTP response object.
   *
   * @example
   * cookieService.clearRefreshTokenCookie(res);
   */
  clearRefreshTokenCookie(res: Response): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === PROD_ENV,
      path: '/',
      sameSite: this.configService.get('NODE_ENV') === PROD_ENV ? 'none' : 'strict'
    };
    res.clearCookie('RefreshToken', cookieOptions);
  }
}
