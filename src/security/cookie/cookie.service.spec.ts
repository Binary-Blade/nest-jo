import { Test, TestingModule } from '@nestjs/testing';
import { CookieService } from './cookie.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@common/utils/utils.service';
import { Request, Response } from 'express';

describe('CookieService', () => {
  let service: CookieService;
  let configService: ConfigService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookieService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: UtilsService,
          useValue: {
            convertDaysToSeconds: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CookieService>(CookieService);
    configService = module.get<ConfigService>(ConfigService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  describe('extractRefreshTokenCookie', () => {
    it('should extract the refresh token from the request cookies', () => {
      const req = { cookies: { RefreshToken: 'refresh_token' } } as unknown as Request;
      const result = service.extractRefreshTokenCookie(req);
      expect(result).toBe('refresh_token');
    });
  });

  describe('setRefreshTokenCookie', () => {
    it('should set the refresh token cookie in the response', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_TOKEN_EXPIRATION') return '1d';
        if (key === 'NODE_ENV') return 'production';
        return null;
      });

      jest.spyOn(utilsService, 'convertDaysToSeconds').mockReturnValue(86400);

      const res = { cookie: jest.fn() } as unknown as Response;
      service.setRefreshTokenCookie(res, 'refresh_token');

      expect(res.cookie).toHaveBeenCalledWith('RefreshToken', 'refresh_token', {
        httpOnly: true,
        secure: true,
        maxAge: 86400 * 1000,
        path: '/',
        sameSite: 'none'
      });
    });

    it('should throw an error if JWT_REFRESH_TOKEN_EXPIRATION is not configured', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);
      const res = {} as Response;
      expect(() => service.setRefreshTokenCookie(res, 'refresh_token')).toThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION is not configured.'
      );
    });
  });

  describe('clearRefreshTokenCookie', () => {
    it('should clear the refresh token cookie in the response', () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;
      service.clearRefreshTokenCookie(res);
      expect(res.clearCookie).toHaveBeenCalledWith('RefreshToken', { path: '/' });
    });
  });
});
