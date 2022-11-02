import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { CreateUser } from "src/user/dto/create-user";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";

import { hashPassword } from '../util/encrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ) {}

    async register(createUser: CreateUser): Promise<User> {
        const user = await this.usersService.findOneByEmail(createUser.email);
        if (user) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
        }

        const hashedPassword = await hashPassword(createUser.password);

        return await this.usersService.create({
            email: createUser.email,
            password: hashedPassword
        });
    }
}