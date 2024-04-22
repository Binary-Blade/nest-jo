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
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserId } from '@common/decorators/user-id.decorator';
import { TokenService } from '@security/token/token.service';
import { AccessTokenGuard } from '@security/guards';
import { LoginDTO } from './dto/login.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { Request, Response } from 'express';

/**
 * Controller that handles authentication-related requests.
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructs the authentication controller.
   *
   * @param authService The service that handles authentication business logic.
   * @param tokenService The service that handles token operations.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Endpoint for creating a new user account.
   *
   * @param createUserDto The data transfer object containing new user data.
   * @returns A promise resolved to the created user.
   */
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  /**
   * Endpoint for authenticating a user and returning access and refresh tokens.
   *
   * @param loginDto The data transfer object containing user login credentials.
   * @returns A promise resolved to an object containing JWT tokens.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res() response: Response) {
    const { email, password } = loginDto;
    return await this.authService.login(email, password, response);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  async updatePassword(@UserId() userId: number, @Body() updatePasswordDto: UpdatePasswordDTO) {
    return await this.authService.updatePassword(
      userId,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-refresh-token')
  async getRefreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.tokenService.refreshToken(req, res);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Failed to refresh token', error: error.toString() });
    }
  }

  /**
   * Endpoint for refreshing the JWT access token using a refresh token.
   * This endpoint is protected and requires a valid access token.
   *
   * @param refreshTokenDto The data transfer object containing the refresh token.
   * @returns A promise resolved to a new set of access and refresh tokens.
   */
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return await this.tokenService.refreshToken(req, res);
  }

  /**
   * Endpoint for logging out a user by invalidating their refresh token.
   *
   * @param  req The request object containing the user's ID.
   * @returns A promise resolved to a message indicating successful logout.
   */
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@UserId() userId: number, @Res() response: Response) {
    await this.authService.logout(userId, response);
    return { message: 'Logged out successfully' };
  }
}
