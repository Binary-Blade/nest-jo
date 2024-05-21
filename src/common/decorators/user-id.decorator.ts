import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/*
 * Custom decorator that extracts the user ID from the request object.
 * This decorator can be used to inject the user ID into a controller method.
 * @returns The user ID extracted from the request object.
 */
export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user?.userId;
});
