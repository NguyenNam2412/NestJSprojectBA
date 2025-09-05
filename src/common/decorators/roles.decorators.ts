import { SetMetadata } from '@nestjs/common';
import { Role } from '@users/role.enum';

// string key to store roles metadata
export const ROLES_KEY = 'roles';
// assign roles to routes so that RolesGuard can check
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
