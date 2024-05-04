import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from '@security/encryption/encryption.service';
import { TokenService } from '@security/token/token.service';
import { CookieService } from '@security/cookie/cookie.service';
import { RefreshTokenStoreService } from '@security/token/refreshtoken-store.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserRole } from '@common/enums/user-role.enum';
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let encryptionService: EncryptionService;
  let tokenService: TokenService;
  let cookieService: CookieService;
  let refreshTokenStoreService: RefreshTokenStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: EncryptionService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
            generatedKeyUuid: jest.fn()
          }
        },
        {
          provide: TokenService,
          useValue: {
            getTokens: jest.fn()
          }
        },
        {
          provide: CookieService,
          useValue: {
            setRefreshTokenCookie: jest.fn()
          }
        },
        {
          provide: RefreshTokenStoreService,
          useValue: {
            removeRefreshTokenRedis: jest.fn()
          }
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    encryptionService = module.get<EncryptionService>(EncryptionService);
    tokenService = module.get<TokenService>(TokenService);
    cookieService = module.get<CookieService>(CookieService);
    refreshTokenStoreService = module.get<RefreshTokenStoreService>(RefreshTokenStoreService);
  });

  describe('signup', () => {
    it('should successfully sign up a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const hashedPassword = 'hashedPassword';
      const newUser = new User();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(encryptionService, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(encryptionService, 'generatedKeyUuid').mockResolvedValue('some-uuid-key');
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);

      const result = await authService.signup(createUserDto);

      expect(result).toBe(newUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(encryptionService.hashPassword).toHaveBeenCalledWith(createUserDto.password);
      expect(encryptionService.generatedKeyUuid).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.USER,
        accountKey: 'some-uuid-key',
        createdAt: expect.any(Date)
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(new User());

      await expect(authService.signup(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should successfully login a user and set cookies', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = new User();
      user.password = 'hashedPassword';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(tokenService, 'getTokens').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken'
      });
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const response = {
        json: jest.fn()
      } as unknown as Response;

      await authService.login(email, password, response);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(encryptionService.verifyPassword).toHaveBeenCalledWith('hashedPassword', password);
      expect(tokenService.getTokens).toHaveBeenCalledWith(user);
      expect(cookieService.setRefreshTokenCookie).toHaveBeenCalledWith(response, 'refreshToken');
      expect(response.json).toHaveBeenCalledWith({ accessToken: 'accessToken' });
    });

    it('should throw InvalidCredentialsException if email does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        authService.login('test@example.com', 'password123', {} as Response)
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException if password does not match', async () => {
      const user = new User();
      user.password = 'hashedPassword';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.login('test@example.com', 'password123', {} as Response)
      ).rejects.toThrow(InvalidCredentialsException);
    });
  });

  describe('updatePassword', () => {
    it("should successfully update a user's password", async () => {
      const user = new User();
      user.password = 'oldPassword';
      const userId = 1;
      const newPassword = 'newPassword';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(encryptionService, 'hashPassword').mockResolvedValue('hashedNewPassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      await authService.updatePassword(userId, 'oldPassword', newPassword);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ userId });
      expect(encryptionService.verifyPassword).toHaveBeenCalledWith('oldPassword', 'oldPassword');
      expect(encryptionService.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(user.password).toBe('hashedNewPassword');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.updatePassword(1, 'oldPassword', 'newPassword')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw InvalidCredentialsException if old password does not match', async () => {
      const user = new User();
      user.password = 'oldPassword';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.updatePassword(1, 'wrongOldPassword', 'newPassword')
      ).rejects.toThrow(InvalidCredentialsException);
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const user = new User();
      user.userId = 1;
      user.tokenVersion = 0;
      const response = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(refreshTokenStoreService, 'removeRefreshTokenRedis').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      await authService.logout(1, response);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
      expect(refreshTokenStoreService.removeRefreshTokenRedis).toHaveBeenCalledWith(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(response.clearCookie).toHaveBeenCalledWith('RefreshToken', { path: '/' });
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith('Logged out successfully');
      expect(user.tokenVersion).toBe(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.logout(1, {} as Response)).rejects.toThrow(NotFoundException);
    });
  });
});
