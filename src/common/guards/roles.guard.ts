import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@common/decorators/roles.decorators';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorators';
import { Role } from '@users/role.enum';

// nestjs call CanActivate every time a request is made to a route
// guard check user role in JWT payload
@Injectable()
export class RolesGuard implements CanActivate {
  // reflector to read the metadata set by the @Roles() decorator
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const reflector = this.reflector;

    // check if route is @Public()
    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredRoles = reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // route is not restricted to any roles auto pass
    }

    const { user } = context.switchToHttp().getRequest();
    // get user role from JWT payload and check
    return requiredRoles.includes(user.role as Role);
  }
}
