import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./doctor.entity";
import { DoctorsController } from "./doctors.controller";
import { DoctorsService } from "./doctors.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor]),
    ],
    providers: [DoctorsService],
    controllers: [DoctorsController],
    exports: [DoctorsModule, DoctorsService]
})
export class DoctorsModule {}
