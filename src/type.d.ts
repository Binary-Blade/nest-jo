import 'express';
import { User } from '@modules/users/entities/user.entity';

/**
 * Extending the Express Request interface to include a user property.
 * This allows TypeScript to recognize that a user object can be attached to the request.
 *
 * @module
 */
declare module 'express' {
  export interface Request {
    /**
     * The authenticated user attached to the request.
     * This property is optional and includes the User entity along with the userId.
     *
     * @example
     * req.user = { userId: 1, email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', ... }
     */
    user?: User & { userId: number };
  }
}
