import {Controller, Get, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Role} from "./role.entity";
import {RoleAllowed } from "./roles.decorator";
import {RolesGuard} from "./roles.guard";
import {RolesService} from "./roles.service";

@Controller('api/v1')
export class RolesController {
    constructor(
        private rolesService: RolesService, 
    ) {}

    @Get('roles')
    async findAllRoles() {
        return this.rolesService.findAllRoles();
    }

    @Get('admin')
    @RoleAllowed('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    testRole() {
        return 'hey admin';
    }
}
