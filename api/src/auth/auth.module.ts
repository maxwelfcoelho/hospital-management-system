import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/user/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

console.log('*'.repeat(100));
console.log(process.env.DATABASE_NAME)
console.log('*'.repeat(100));

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: '60h' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
    exports: []
})
export class AuthModule {}