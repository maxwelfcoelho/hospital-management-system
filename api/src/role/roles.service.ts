import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Role} from "./role.entity";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) {}

    async findAllRoles(): Promise<Role[]> {
        return await this.rolesRepository.find();
    }

    async findRoleByName(name: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({ where: { name } });
        if (!role) {
            throw new HttpException(`role with name ${name} not found`, HttpStatus.NOT_FOUND);
        }
        return role;
    }
}
