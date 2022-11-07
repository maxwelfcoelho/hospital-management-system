import {Controller, Get} from "@nestjs/common";
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
}
