import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from '@security/token/token.service';
import { SignUpDto } from '@modules/auth/dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { AccessTokenGuard } from '@security/guards';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        TokenService,
        {
          provide: AccessTokenGuard,
          useValue: {
            canActivate: jest.fn()
          }
        },
        Reflector
      ]
    })
      .overrideProvider(AuthService)
      .useValue({
        signup: jest.fn(),
        login: jest.fn(),
        updatePassword: jest.fn(),
        logout: jest.fn()
      })
      .overrideProvider(TokenService)
      .useValue({
        generateAccessTokenFromRefreshToken: jest.fn(),
        refreshToken: jest.fn()
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
  });

  describe('create', () => {
    it('should call AuthService.signup with correct parameters', async () => {
      const createUserDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      await controller.create(createUserDto);
      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDTO = {
        email: 'test@example.com',
        password: 'password123'
      };
      const response = {
        cookie: jest.fn()
      } as unknown as Response;

      await controller.login(loginDto, response);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password, response);
    });
  });

  describe('updatePassword', () => {
    it('should call AuthService.updatePassword with correct parameters', async () => {
      const userId = 1;
      const updatePasswordDto: UpdatePasswordDTO = {
        oldPassword: 'oldpassword',
        newPassword: 'newpassword'
      };

      await controller.updatePassword(userId, updatePasswordDto);
      expect(authService.updatePassword).toHaveBeenCalledWith(
        userId,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should call TokenService.generateAccessTokenFromRefreshToken with correct parameters', async () => {
      const req = {
        cookies: {
          refresh_token: 'some_refresh_token'
        }
      } as unknown as Request;
      const res = {} as unknown as Response;

      await controller.getRefreshToken(req, res);
      expect(tokenService.generateAccessTokenFromRefreshToken).toHaveBeenCalledWith(req, res);
    });
  });

  describe('refreshToken', () => {
    it('should call TokenService.refreshToken with correct parameters', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.refreshToken(req, res);
      expect(tokenService.refreshToken).toHaveBeenCalledWith(req, res);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout with correct parameters', async () => {
      const userId = 1;
      const response = {} as unknown as Response;

      const result = await controller.logout(userId, response);
      expect(authService.logout).toHaveBeenCalledWith(userId, response);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
