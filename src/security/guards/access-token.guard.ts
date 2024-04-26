import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that checks for a valid access token.
 * This guard is used to protect routes that require a valid access token.
 * It uses the JWT strategy provided by Passport.
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}
