import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * Strategy for validating access tokens.
 *
 * @class
 * @extends PassportStrategy
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * @param {Repository<User>} usersRepository - Repository for the User entity.
   * @param {ConfigService} configService - Service to access application configuration.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header as a Bearer token
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? '', // Get the secret key for verifying the token from configuration
      ignoreExpiration: false // Ensure the expiration is not ignored
    });
  }

  /**
   * Validate the JWT payload.
   *
   * @param {JwtPayload} payload - The JWT payload containing user information.
   * @returns {Promise<User>} - The validated user.
   * @throws {UnauthorizedException} - If the user is not found or token is invalidated.
   *
   * @example
   * const user = await this.validate(payload);
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId: payload.sub } });
    if (!user || user.tokenVersion !== payload.version) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    // Return the user object for request property attachment if validation passes
    return user;
  }
}
