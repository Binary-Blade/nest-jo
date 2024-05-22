import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Custom decorator to extract the user ID from the request object.
 *
 * @param {unknown} _ - Optional data that can be passed to the decorator.
 * @param {ExecutionContext} ctx - The execution context.
 * @returns {number} - The user ID extracted from the request object.
 *
 * @example
 * \@Get('profile')
 * getProfile(\@UserId() userId: number) {
 *   // Use userId in your route handler
 * }
 */
export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user?.userId;
});
