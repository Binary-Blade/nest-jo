import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { TokenManagementService } from './token-management.service';
import { UsersService } from '@modules/users/users.service';
import { CookieService } from '@security/cookie/cookie.service';
import { RefreshTokenStoreService } from './refreshtoken-store.service';
import { User } from '@modules/users/entities/user.entity';
import { UserRole } from '@common/enums/user-role.enum';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

const mockUser: User = {
  userId: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser',
  password: 'password',
  role: UserRole.USER,
  tokenVersion: 1
};

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

describe('TokenService', () => {
  let service: TokenService;
  let usersService: UsersService;
  let tokenManagementService: TokenManagementService;
  let cookieService: CookieService;
  let refreshTokenStoreService: RefreshTokenStoreService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: UsersService,
          useValue: {
            verifyUserOneBy: jest.fn()
          }
        },
        {
          provide: TokenManagementService,
          useValue: {
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
            verifyToken: jest.fn()
          }
        },
        {
          provide: CookieService,
          useValue: {
            setRefreshTokenCookie: jest.fn(),
            extractRefreshTokenCookie: jest.fn()
          }
        },
        {
          provide: RefreshTokenStoreService,
          useValue: {
            storeRefreshTokenInRedis: jest.fn(),
            verifyRefreshTokenInRedis: jest.fn(),
            removeRefreshTokenRedis: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TokenService>(TokenService);
    usersService = module.get<UsersService>(UsersService);
    tokenManagementService = module.get<TokenManagementService>(TokenManagementService);
    cookieService = module.get<CookieService>(CookieService);
    refreshTokenStoreService = module.get<RefreshTokenStoreService>(RefreshTokenStoreService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getTokens', () => {
    it('should create access and refresh tokens and store the refresh token in Redis', async () => {
      const user = new User();
      user.userId = 1;
      user.role = UserRole.USER;
      user.tokenVersion = 1;

      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      jest.spyOn(tokenManagementService, 'createAccessToken').mockReturnValue(accessToken);
      jest.spyOn(tokenManagementService, 'createRefreshToken').mockReturnValue(refreshToken);

      const result: JWTTokens = await service.getTokens(user);

      expect(result).toEqual({ accessToken, refreshToken });
      expect(tokenManagementService.createAccessToken).toHaveBeenCalledWith({
        sub: user.userId,
        role: user.role,
        version: user.tokenVersion
      });
      expect(tokenManagementService.createRefreshToken).toHaveBeenCalledWith({
        sub: user.userId,
        role: user.role,
        version: user.tokenVersion
      });
      expect(refreshTokenStoreService.storeRefreshTokenInRedis).toHaveBeenCalledWith(
        user.userId,
        refreshToken
      );
    });
  }

  describe('refreshToken', () => {
    it('should refresh tokens and set the refresh token cookie', async () => {
      const req = { cookies: {} } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const user = new User();
      user.userId = 1;
      const accessToken = 'newAccessToken';
      const refreshToken = 'newRefreshToken';

      jest.spyOn(cookieService, 'extractRefreshTokenCookie').mockReturnValue('oldRefreshToken');
      jest
        .spyOn(service, 'validateAndExtractFromRefreshToken')
        .mockResolvedValue({ userId: 1, payload: {} });
      jest.spyOn(usersService, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken, refreshToken });

      await service.refreshToken(req, res);

      expect(cookieService.extractRefreshTokenCookie).toHaveBeenCalledWith(req);
      expect(service.validateAndExtractFromRefreshToken).toHaveBeenCalledWith('oldRefreshToken');
      expect(usersService.verifyUserOneBy).toHaveBeenCalledWith(1);
      expect(refreshTokenStoreService.removeRefreshTokenRedis).toHaveBeenCalledWith(1);
      expect(service.getTokens).toHaveBeenCalledWith(user);
      expect(refreshTokenStoreService.storeRefreshTokenInRedis).toHaveBeenCalledWith(
        1,
        refreshToken
      );
      expect(cookieService.setRefreshTokenCookie).toHaveBeenCalledWith(res, refreshToken);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ accessToken, refreshToken, userId: 1 });
    });

    it('should return an error response when no refresh token is provided', async () => {
      const req = { cookies: {} } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      jest.spyOn(cookieService, 'extractRefreshTokenCookie').mockReturnValue(null);

      await service.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No refresh token provided. Please login again.',
        actionRequired: 'Please login again.'
      });
    });
  });

  describe('generateAccessTokenFromRefreshToken', () => {
    it('should generate a new access token from a refresh token', async () => {
      const req = { cookies: {} } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const accessToken = 'newAccessToken';

      jest.spyOn(cookieService, 'extractRefreshTokenCookie').mockReturnValue('refreshToken');
      jest
        .spyOn(service, 'validateAndExtractFromRefreshToken')
        .mockResolvedValue({ userId: 1, payload: {} });
      jest.spyOn(tokenManagementService, 'createAccessToken').mockReturnValue(accessToken);
      jest.spyOn(configService, 'get').mockReturnValue('1h');

      await service.generateAccessTokenFromRefreshToken(req, res);

      expect(cookieService.extractRefreshTokenCookie).toHaveBeenCalledWith(req);
      expect(service.validateAndExtractFromRefreshToken).toHaveBeenCalledWith('refreshToken');
      expect(tokenManagementService.createAccessToken).toHaveBeenCalledWith({
        sub: 1,
        role: undefined,
        version: undefined
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        accessToken,
        userId: 1,
        expiresIn: '1h'
      });
    });

    it('should return an error response when no refresh token is provided', async () => {
      const req = { cookies: {} } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      jest.spyOn(cookieService, 'extractRefreshTokenCookie').mockReturnValue(null);

      await service.generateAccessTokenFromRefreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No refresh token provided. Please login again.',
        actionRequired: 'Please login again.'
      });
    });
  });

  describe('validateAndExtractFromRefreshToken', () => {
    it('should validate and extract the payload from a refresh token', async () => {
      const refreshToken = 'refreshToken';
      const payload = { sub: 1, role: UserRole.USER, version: 1 };

      jest.spyOn(tokenManagementService, 'verifyToken').mockResolvedValue(payload);
      jest.spyOn(refreshTokenStoreService, 'verifyRefreshTokenInRedis').mockResolvedValue(true);

      const result = await service.validateAndExtractFromRefreshToken(refreshToken);

      expect(result).toEqual({ payload, userId: 1 });
      expect(tokenManagementService.verifyToken).toHaveBeenCalledWith(refreshToken);
      expect(refreshTokenStoreService.verifyRefreshTokenInRedis).toHaveBeenCalledWith(
        1,
        refreshToken
      );
    });

    it('should throw UnauthorizedException if the token is invalid or expired', async () => {
      const refreshToken = 'invalidToken';

      jest.spyOn(tokenManagementService, 'verifyToken').mockRejectedValue(new Error('Token error'));

      await expect(service.validateAndExtractFromRefreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if the refresh token does not match', async () => {
      const refreshToken = 'refreshToken';
      const payload = { sub: 1, role: UserRole.USER, version: 1 };

      jest.spyOn(tokenManagementService, 'verifyToken').mockResolvedValue(payload);
      jest.spyOn(refreshTokenStoreService, 'verifyRefreshTokenInRedis').mockResolvedValue(false);

      await expect(service.validateAndExtractFromRefreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
