import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for invalid login credentials.
 * @class
 * @extends {HttpException}
 */
export class InvalidCredentialsException extends HttpException {
  /**
   * Constructs a new InvalidCredentialsException.
   *
   * @example
   * throw new InvalidCredentialsException();
   */

  // Make it in french
  constructor() {
    super('Identifiants invalides', HttpStatus.UNAUTHORIZED);
  }
}
