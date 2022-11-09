import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.entity";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.doctor, {
        cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE',
    })
    @JoinColumn()
    user: User;
}
