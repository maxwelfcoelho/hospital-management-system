import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import {Role} from "../role/role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(type => Role, role => role.user)
    role: Role;
}
