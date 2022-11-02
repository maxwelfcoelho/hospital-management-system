import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CreateUser } from "src/user/dto/create-user";
import { User } from "src/user/user.entity";
import { AuthService } from "./auth.service";

@Controller('api/v1')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('register')
    @HttpCode(201)
    async register(@Body() createUser: CreateUser): Promise<User> {
        return await this.authService.register(createUser);
    }
}