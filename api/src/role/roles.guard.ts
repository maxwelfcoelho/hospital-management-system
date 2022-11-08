import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UsersService} from "src/user/users.service";
import {ROLES_KEY} from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRole) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user.role) {
            return false;
        }

        const userRole = user.role.name;

        return requiredRole === userRole;
    }
}
