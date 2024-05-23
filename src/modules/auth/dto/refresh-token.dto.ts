import { IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for refreshing a token.
 *
 * @class
 */
export class RefreshTokenDto {
  /**
   * The refresh token.
   * This field is required and must not be empty.
   * @type {string}
   * @isNotEmpty
   *
   * @example
   * const dto: RefreshTokenDto = { refreshToken: 'some-refresh-token' };
   */
  @IsNotEmpty()
  readonly refreshToken: string;
}
