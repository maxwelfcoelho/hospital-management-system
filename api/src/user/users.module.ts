import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {Doctor} from "./doctor/doctor.entity";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Doctor]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersModule, UsersService]
})
export class UsersModule {}
