import { Test, TestingModule } from '@nestjs/testing';
import { TokenManagementService } from './token-management.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Payload } from '@common/interfaces/payload.interface';
import { UserRole } from '@common/enums/user-role.enum';

describe('TokenManagementService', () => {
  let service: TokenManagementService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenManagementService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verifyAsync: jest.fn()
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

    service = module.get<TokenManagementService>(TokenManagementService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createAccessToken', () => {
    it('should create an access token', () => {
      const payload: Payload = { sub: 1, role: UserRole.USER, version: 1 };
      const secret = 'testAccessSecret';
      const expiration = '1h';
      const token = 'accessToken';

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_TOKEN_SECRET') return secret;
        if (key === 'JWT_ACCESS_TOKEN_EXPIRATION') return expiration;
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.createAccessToken(payload);
      expect(result).toBe(token);
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_TOKEN_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_TOKEN_EXPIRATION');
      expect(jwtService.sign).toHaveBeenCalledWith(payload, { secret, expiresIn: expiration });
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token', () => {
      const payload: Payload = { sub: 1, role: UserRole.USER, version: 1 };
      const secret = 'testRefreshSecret';
      const expiration = '7d';
      const token = 'refreshToken';

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_TOKEN_SECRET') return secret;
        if (key === 'JWT_REFRESH_TOKEN_EXPIRATION') return expiration;
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.createRefreshToken(payload);
      expect(result).toBe(token);
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_TOKEN_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_TOKEN_EXPIRATION');
      expect(jwtService.sign).toHaveBeenCalledWith(payload, { secret, expiresIn: expiration });
    });
  });

  describe('verifyToken', () => {
    it('should verify an access token', async () => {
      const token = 'testToken';
      const payload = { sub: 1, role: UserRole.USER, version: 1 };
      const secret = 'testAccessSecret';

      jest.spyOn(configService, 'get').mockReturnValue(secret);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      const result = await service.verifyToken(token, true);
      expect(result).toBe(payload);
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_TOKEN_SECRET');
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, { secret });
    });

    it('should verify a refresh token', async () => {
      const token = 'testToken';
      const payload = { sub: 1, role: UserRole.USER, version: 1 };
      const secret = 'testRefreshSecret';

      jest.spyOn(configService, 'get').mockReturnValue(secret);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      const result = await service.verifyToken(token);
      expect(result).toBe(payload);
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_TOKEN_SECRET');
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, { secret });
    });
  });
});
