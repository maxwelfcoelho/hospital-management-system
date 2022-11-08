import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./role.entity";
import {RolesController} from "./roles.controller";
import {RolesService} from "./roles.service";

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesModule, RolesService],
})
export class RolesModule {}
