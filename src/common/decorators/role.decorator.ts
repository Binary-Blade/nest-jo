import { UserRole } from '@common/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';

/**
 * Key used to store role metadata.
 * @constant {string}
 */
export const ROLE_KEY: string = 'role';

/**
 * Decorator to set the role metadata on a route handler.
 *
 * @param {UserRole} role - The role to set.
 * @returns {MethodDecorator} - The role metadata decorator.
 *
 * @example
 * \@Role(UserRole.ADMIN)
 * \@UseGuards(RoleGuard)
 * \@Get('admin')
 * getAdminData() {
 *   // Admin route logic here
 * }
 */
export const Role = (role: UserRole): MethodDecorator => SetMetadata(ROLE_KEY, role);
