import { UserRole } from '@common/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';

/**
 * The key for the role metadata
 * @type {string}
 */
export const ROLE_KEY: string = 'role';

/**
 * Decorator to set the role of a user
 *
 * @param role The role of the user
 */
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
