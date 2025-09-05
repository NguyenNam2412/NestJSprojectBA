import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@common/decorators/roles.decorators';
import { Role } from '@users/role.enum';

// nestjs call CanActivate every time a request is made to a route
// guard check user role in JWT payload
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // route is not restricted to any roles
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role as Role);
  }
}
