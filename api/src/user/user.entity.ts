import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import {Role} from "../role/role.entity";
import {Doctor} from "./doctor/doctor.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    phone: string;

    @ManyToOne(type => Role, role => role.user)
    role: Role;

    @OneToOne(() => Doctor, (doctor) => doctor.user, {
        onDelete: 'CASCADE',
    })
    doctor: Doctor;
}
