import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';

/**
 * Guard to check if the user has the required role to access the route.
 * @class
 * @implements {CanActivate}
 *
 * @example
 * \@UseGuards(RoleGuard)
 * \@Role(UserRole.ADMIN)
 * \@Get('admin')
 * getAdminData() {
 *   // Admin route logic here
 * }
 */
@Injectable()
export class RoleGuard implements CanActivate {
  /**
   * Creates an instance of RoleGuard.
   *
   * @constructor
   * @param {Reflector} reflector - The reflector to retrieve metadata.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Method to determine if the user can activate the route based on their role.
   *
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Whether the user can activate the route.
   *
   * @example
   * const canActivate = roleGuard.canActivate(context);
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve the required role for the route from the metadata.
    const requiredRole = this.reflector.getAllAndOverride<UserRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    // If no specific role is required, allow access.
    if (!requiredRole) {
      return true;
    }

    // Get the user object from the request and compare roles.
    const { user } = context.switchToHttp().getRequest();
    return user.role === requiredRole;
  }
}
