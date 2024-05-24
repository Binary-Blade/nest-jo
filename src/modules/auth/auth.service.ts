import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';
import { TokenService } from '@security/token/token.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UserRole } from '@common/enums/user-role.enum';
import { Response } from 'express';
import { CookieService } from '@security/cookie/cookie.service';
import { RefreshTokenStoreService } from '@security/token/refreshtoken-store.service';
import { CartsService } from '@modules/carts/carts.service';
import { SignUpDto } from './dto/signup.dto';

/**
 * Service to manage authentication and user-related operations.
 * @class
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @constructor
   * @param {Repository<User>} usersRepository - Repository for the User entity.
   * @param {CartsService} cartService - Service to manage carts.
   * @param {EncryptionService} encryptionService - Service to manage encryption.
   * @param {TokenService} tokenService - Service to manage tokens.
   * @param {CookieService} cookieService - Service to manage cookies.
   * @param {RefreshTokenStoreService} refreshTokenStoreService - Service to manage refresh tokens.
   */
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private cartService: CartsService,
    private encryptionService: EncryptionService,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private refreshTokenStoreService: RefreshTokenStoreService
  ) {}

  /**
   * Registers a new user.
   *
   * @param {CreateUserDto} createUserDto - DTO containing user registration data.
   * @param {UserRole} [role=UserRole.USER] - Role of the new user.
   * @returns {Promise<User>} - The created user.
   *
   * @throws {UnauthorizedException} If the email is already used.
   *
   * @example
   * const user = await authService.signup(createUserDto);
   */
  async signup(createUserDto: SignUpDto, role: UserRole = UserRole.USER): Promise<User> {
    const normalizedEmail = createUserDto.email.toLowerCase();
    const existingUser = await this.usersRepository.findOneBy({ email: normalizedEmail });
    if (existingUser) {
      throw new UnauthorizedException('Cet email est déjà utilisé. Veuillez en choisir un autre.');
    }
    const hashedPassword = await this.encryptionService.hashPassword(createUserDto.password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      accountKey: await this.encryptionService.generatedKeyUuid(),
      createdAt: new Date()
    });
    return this.usersRepository.save(newUser);
  }

  /**
   * Logs in a user.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>}
   *
   * @throws {InvalidCredentialsException} If the email or password is invalid.
   * @throws {UnauthorizedException} If the user is not active.
   *
   * @example
   * await authService.login('user@example.com', 'password123', res);
   */
  async login(email: string, password: string, res: Response): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.usersRepository.findOneBy({ email: normalizedEmail });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    const validPassword = await this.encryptionService.verifyPassword(user.password, password);
    if (!validPassword) {
      throw new InvalidCredentialsException();
    }
    user.lastLogin = new Date();
    await this.usersRepository.save(user);
    await this.cartService.getOrCreateCart(user.userId);

    const { accessToken, refreshToken } = await this.tokenService.getTokens(user);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);
    res.json({ accessToken, userId: user.userId });
  }

  /**
   * Updates a user's password.
   *
   * @param {number} userId - ID of the user.
   * @param {string} oldPassword - User's current password.
   * @param {string} newPassword - User's new password.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the user is not found.
   * @throws {HttpException} If the old password is incorrect.
   *
   * @example
   * await authService.updatePassword(1, 'oldPassword', 'newPassword');
   */
  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException();
    }
    const validPassword = await this.encryptionService.verifyPassword(user.password, oldPassword);
    if (!validPassword) {
      throw new HttpException('Invalid password', 400);
    }

    const hashedPassword = await this.encryptionService.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  /**
   * Logs out a user.
   *
   * @param {number} userId - ID of the user.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * await authService.logout(1, res);
   */
  async logout(userId: number, res: Response): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('User not connected');
    }

    user.tokenVersion += 1;
    await this.refreshTokenStoreService.removeRefreshTokenRedis(userId);
    await this.usersRepository.save(user);

    this.cookieService.clearRefreshTokenCookie(res);
    res.status(200).send('Logged out successfully');
  }

  /**
   * Deletes a user.
   *
   * @param {number} userId - ID of the user.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>}
   *
   * @example
   * await authService.delete(1, res);
   */
  async delete(userId: number, res: Response): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId });
    await this.refreshTokenStoreService.removeRefreshTokenRedis(userId);
    await this.usersRepository.remove(user);
    this.cookieService.clearRefreshTokenCookie(res);
    res.status(200).send('User deleted successfully');
  }
}
