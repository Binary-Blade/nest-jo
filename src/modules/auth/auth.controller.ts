import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  Req,
  Delete,
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserId } from '@common/decorators/user-id.decorator';
import { TokenService } from '@security/token/token.service';
import { AccessTokenGuard, IsCreatorGuard } from '@security/guards';
import { LoginDTO } from './dto/login.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { Request, Response } from 'express';
import { User } from '@modules/users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';

/**
 * Controller to manage authentication and user-related operations.
 * @class
 */
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   *
   * @constructor
   * @param {AuthService} authService - Service to manage authentication.
   * @param {TokenService} tokenService - Service to manage tokens.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Registers a new user.
   *
   * @param {CreateUserDto} createUserDto - DTO containing user registration data.
   * @returns {Promise<User>} - The created user.
   *
   * @example
   * POST /auth/signup
   * {
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "firstName": "First",
   *   "lastName": "Last"
   * }
   */
  @Post('signup')
  create(@Body() createUserDto: SignUpDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  /**
   * Logs in a user.
   *
   * @param {LoginDTO} loginDto - DTO containing user login data.
   * @param {Response} response - HTTP response object.
   * @returns {Promise<void>}
   *
   * @example
   * POST /auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   */
  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res() response: Response): Promise<void> {
    const { email, password } = loginDto;
    return await this.authService.login(email, password, response);
  }

  /**
   * Updates a user's password. Only accessible by the user.
   *
   * @param {number} userId - ID of the user.
   * @param {UpdatePasswordDTO} updatePasswordDto - DTO containing old and new passwords.
   * @returns {Promise<void>}
   *
   * @example
   * PATCH /auth/change-password
   * {
   *   "oldPassword": "oldPassword123",
   *   "newPassword": "newPassword123"
   * }
   */
  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  async updatePassword(
    @UserId() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDTO
  ): Promise<void> {
    return await this.authService.updatePassword(
      userId,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword
    );
  }

  /**
   * Generates a new access token using a refresh token.
   *
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>}
   *
   * @example
   * POST /auth/access-token
   */
  @HttpCode(HttpStatus.OK)
  @Post('access-token')
  async getRefreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.tokenService.generateAccessTokenFromRefreshToken(req, res);
  }

  /**
   * Refreshes the user's tokens.
   *
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<any>}
   *
   * @example
   * POST /auth/refresh-token
   */
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.tokenService.refreshToken(req, res);
  }

  /**
   * Logs out a user. Only accessible by the user.
   *
   * @param {number} userId - ID of the user.
   * @param {Response} response - HTTP response object.
   * @returns {Promise<{ message: string }>}
   *
   * @example
   * POST /auth/logout
   */
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@UserId() userId: number, @Res() response: Response): Promise<{ message: string }> {
    await this.authService.logout(userId, response);
    return { message: 'Logged out successfully' };
  }

  /**
   * Deletes a user. Only accessible by the user.
   *
   * @param {string} id - ID of the user.
   * @param {Response} response - HTTP response object.
   * @returns {Promise<void>}
   *
   * @example
   * DELETE /auth/delete/1
   */
  @UseGuards(AccessTokenGuard, IsCreatorGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Res() response: Response): Promise<void> {
    return this.authService.delete(+id, response);
  }
}
