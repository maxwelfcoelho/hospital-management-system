import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('api/v1')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async hello() {
        return await this.usersService.findAll();
    }
}