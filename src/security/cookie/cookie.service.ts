import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PROD_ENV } from '@utils/constants.env';
import { ConvertUtilsService } from '@utils/convert-utils.service';
import { CookieOptions, Request, Response } from 'express';

/**
 * Service responsible for handling cookies.
 * This service provides methods for extracting, setting, and clearing cookies.
 */
@Injectable()
export class CookieService {
  constructor(
    private configService: ConfigService,
    private convertUtilsService: ConvertUtilsService
  ) {}

  /**
   * Extracts the access token from the request cookies.
   *
   * @param req The request object.
   * @returns The access token.
   */
  extractRefreshTokenCookie(req: Request): string {
    return req.cookies['RefreshToken'];
  }

  /**
   * Sets the refresh token cookie in the response.
   * The cookie is set with the specified expiration time and secure flag.
   *
   * @param res The response object.
   * @param refreshToken The refresh token to set.
   * @returns void
   * @throws Error if the refresh token expiration time is not set in the configuration.
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
   * Clears the refresh token cookie in the response.
   *
   * @param res The response object.
   * @returns void
   * @throws Error if the refresh token expiration time is not set in the configuration.
   */
  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('RefreshToken', { path: '/' });
  }
}
