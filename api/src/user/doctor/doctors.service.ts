import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {hashPassword} from "../../util/encrypt";
import { Repository } from "typeorm";
import {User} from "../user.entity";
import { Doctor } from "./doctor.entity";
import {DoctorRequest} from "./dtos/doctor-request";

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
    ) {}

    async findAllDoctors(): Promise<Doctor[]> {
        return await this.doctorsRepository.find({
            select: {
                user: {
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            relations: {
                user: true,
            }
        });
    }

    async create(doctorRequest: DoctorRequest) {
        const hashedPassword = await hashPassword(doctorRequest.password);

        const doctor = new Doctor();
        const user = new User();
        user.name = doctorRequest.name;
        user.email = doctorRequest.email;
        user.password = hashedPassword;
        user.phone = doctorRequest.phone;
        doctor.user = user; 

        await this.doctorsRepository.save(doctor);
    }

    async deleteDoctorById(id: number) {
        const doctor = await this.doctorsRepository.findOneBy({
            id,
        });

        return await this.doctorsRepository.remove(doctor);
    }
}
