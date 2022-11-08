import {Role} from "src/role/role.entity";

export class CreateUser {
    email: string;
    password: string;
    role?: Role;
}
