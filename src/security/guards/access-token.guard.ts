import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard to protect routes using JWT access tokens.
 * @class
 * @extends {AuthGuard('jwt')}
 *
 * @example
 * \@UseGuards(AccessTokenGuard)
 * \@Get('protected-route')
 * getProtectedData() {
 *   // Protected route logic here
 * }
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}
