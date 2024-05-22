import { UserRole } from '@common/enums/user-role.enum';

/**
 * Interface representing the payload of a JWT.
 *
 * @interface Payload
 */
export interface Payload {
  /**
   * Subject identifier (usually the user ID).
   * @type {number}
   *
   * @example
   * const payload: Payload = { sub: 1, role: UserRole.USER, version: 1 };
   */
  sub: number;

  /**
   * Role of the user.
   * @type {UserRole}
   *
   * @example
   * const payload: Payload = { sub: 1, role: UserRole.ADMIN, version: 1 };
   */
  role: UserRole;

  /**
   * Version of the token.
   * @type {number}
   *
   * @example
   * const payload: Payload = { sub: 1, role: UserRole.USER, version: 2 };
   */
  version: number;
}
