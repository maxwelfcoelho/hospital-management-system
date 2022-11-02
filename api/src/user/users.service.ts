import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUser } from "./dto/create-user";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }
    
    async findOne(id: number): Promise<User> {
        return await this.usersRepository.findOneBy({ id });
    }

    async create(createUser: CreateUser): Promise<User> {
        const user = new User();
        user.email = createUser.email;
        user.password = createUser.password;
        return await this.usersRepository.save(user);
    }
    
    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}