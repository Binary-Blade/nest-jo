import { UserRole } from '@common/enums/user-role.enum';

/**
 * Payload for the JWT token
 *
 * @property {number} sub - The subject of the JWT.
 * @property {UserRole} role - The role of the user.
 * @property {number} version - The version of the JWT.
 */
export interface Payload {
  sub: number;
  role: UserRole;
  version: number;
}
