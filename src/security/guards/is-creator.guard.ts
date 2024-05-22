import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard to check if the current user is the creator of the content.
 * @class
 * @implements {CanActivate}
 *
 * @example
 * \@UseGuards(IsCreatorGuard)
 * \@Patch(':id')
 * updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
 *   // Update content logic here
 * }
 */
@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Method to determine if the current user can activate the route.
   *
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean} - Whether the user can activate the route.
   *
   * @throws {NotFoundException} If the user is not the creator of the content.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const contentOwnerId = +request.params.id;

    // Check if the current user ID matches the content owner's ID.
    const isCreator = user && user.userId === contentOwnerId;
    if (!isCreator) {
      throw new NotFoundException(`Content not found or access unauthorized.`);
    }

    // Optionally add isCreator flag to the request object for further use.
    request.isCreator = isCreator;
    return true;
  }
}
