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
  constructor() {
    super('Invalid Login Credentials. Please try again.', HttpStatus.UNAUTHORIZED);
  }
}
