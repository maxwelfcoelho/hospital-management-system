import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

import { CreateUser } from "src/user/dtos/create-user";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";

import { comparePasswords, hashPassword } from '../util/encrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await comparePasswords(password, user.password)) {
            const { password, isActive, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}