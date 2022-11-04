import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { CreateUser } from "src/user/dtos/create-user";
import { User } from "src/user/user.entity";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

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
    async login(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const accessToken = await this.authService.login(request.user);
     
        // Todo: add secure to true, same site and add an expiration date
        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async profile(@Req() request: Request) {
        return request.user;
    }
}
