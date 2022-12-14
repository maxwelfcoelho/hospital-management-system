import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUser } from "./dtos/create-user";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    
    async findOneById(id: number): Promise<User> {
        return await this.usersRepository.findOneBy({ id });
    }

    async findOneByIdWithRole(id: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                id: id,
            },
            relations: ['role'],
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOneBy({ email });
    }

    async create(createUser: CreateUser): Promise<User> {
        const user = new User();
        user.email = createUser.email;
        user.password = createUser.password;
        user.role = createUser.role;
        return await this.usersRepository.save(user);
    }
}
