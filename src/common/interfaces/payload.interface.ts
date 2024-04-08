import { UserRole } from '@common/enums/user-role.enum';

export interface Payload {
  sub: number;
  role: UserRole;
  version: number;
}
