import { UtilsService } from '@common/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  constructor(
    private configService: ConfigService,
    private utilsService: UtilsService
  ) {}

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const refreshTokenExpiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');
    const refreshTokenTTL = this.utilsService.convertDaysToSeconds(refreshTokenExpiration);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: refreshTokenTTL * 1000,
      path: '/',
      sameSite: 'strict'
    };
    res.cookie('RefreshToken', refreshToken, cookieOptions);
  }

  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('RefreshToken', { path: '/' });
  }
}
