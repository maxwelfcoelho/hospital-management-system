import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import {UsersService} from "../../user/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const token = request?.cookies['accessToken'];
                if (!token) {
                    return null;
                }
                return token;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOneByIdWithRole(payload.sub);

        return { id: payload.sub, email: payload.email, role: user.role };
    }
}
