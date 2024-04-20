import { Payload } from '@common/interfaces/payload.interface';
import { RedisService } from '@database/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenManagementService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {}

  createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION')
    });
  }

  createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION')
    });
  }

  verifyToken(token: string, isAccessToken: boolean = false): any {
    const secretKey = isAccessToken
      ? this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
      : this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    return this.jwtService.verifyAsync(token, { secret: secretKey });
  }

  async refreshTokenRedisExist(userId: number, refreshToken: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === refreshToken;
  }
}
