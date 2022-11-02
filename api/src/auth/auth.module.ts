import { Module } from "@nestjs/common";
import { UsersModule } from "src/user/users.module";
import { UsersService } from "src/user/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {}