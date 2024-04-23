import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@database/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@common/utils/utils.service';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Payload } from '@common/interfaces/payload.interface';
import { Request, Response } from 'express';
import { TokenManagementService } from './token-management.service';
import { CookieService } from './cookie.service';

/**
 * Service responsible for managing JWT tokens, including their creation and validation.
 * This service utilizes the JwtService for signing tokens with specified secrets and expiration times.
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  /**
   * Constructs the TokenService with the required dependencies.
   */
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private tokenManagementService: TokenManagementService,
    private cookieService: CookieService,
    private configService: ConfigService,
    private redisService: RedisService,
    private utilsService: UtilsService
  ) {}

  async getTokens(user: User): Promise<JWTTokens> {
    const payload = this.createPayload(user);
    const accessToken = this.tokenManagementService.createAccessToken(payload);
    const refreshToken = this.tokenManagementService.createRefreshToken(payload);

    await this.storeRefreshTokenRedis(user.userId, refreshToken);
    return { accessToken, refreshToken };
  }

  private createPayload(user: User): Payload {
    return { sub: user.userId, role: user.role, version: user.tokenVersion };
  }

  private async storeRefreshTokenRedis(userId: number, refreshToken: string): Promise<void> {
    const refreshTokenTTL = this.utilsService.convertDaysToSeconds(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    );
    await this.redisService.set(`refresh_token_${userId}`, refreshToken, refreshTokenTTL);
  }

  async removeRefreshTokenRedis(userId: number) {
    await this.redisService.del(`refresh_token_${userId}`);
  }

  async refreshToken(req: Request, res: Response): Promise<any> {
    const oldRefreshToken = this.cookieService.extractRefreshTokenCookie(req);
    try {
      const payload = await this.tokenManagementService.verifyToken(oldRefreshToken);
      const userId = payload.sub;

      const user = await this.usersRepository.findOneOrFail({ where: { userId } });
      await this.redisService.del(`refresh_token_${userId}`);

      const { accessToken, refreshToken } = await this.getTokens(user);
      const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');
      await this.storeRefreshTokenRedis(userId, refreshToken);

      this.cookieService.setRefreshTokenCookie(res, refreshToken);
      return res.status(HttpStatus.OK).json({ accessToken, refreshToken, expiresIn, userId });
    } catch (error) {
      this.logger.error('Token refresh error', { error: error.message, stack: error.stack });
      if (error instanceof UnauthorizedException) {
        this.cookieService.clearRefreshTokenCookie(res);
        throw error;
      }
      throw new UnauthorizedException('Could not refresh the token. Please try again or log in.');
    }
  }
}
