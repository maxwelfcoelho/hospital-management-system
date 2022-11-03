import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUser } from "src/user/dtos/create-user";
import { User } from "src/user/user.entity";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }
}