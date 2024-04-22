import 'express';
import { User } from '@modules/users/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: User & { userId: number };
  }
}
