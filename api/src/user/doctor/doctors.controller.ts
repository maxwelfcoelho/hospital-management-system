import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import {JwtAuthGuard} from "src/auth/guards/jwt-auth.guard";
import {RoleAllowed} from "src/role/roles.decorator";
import {RolesGuard} from "src/role/roles.guard";
import { DoctorsService } from "./doctors.service";
import {DoctorRequest} from "./dtos/doctor-request";

@Controller('api/v1')
export class DoctorsController {
    constructor(
        private doctorsService: DoctorsService,
    ) {}

    @Get('doctors')
    //@RoleAllowed('admin')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    async findAllDoctors() {
        return await this.doctorsService.findAllDoctors();
    }

    @Post('create-doctor')
    async create(@Body() doctorRequest: DoctorRequest) {
        return await this.doctorsService.create(doctorRequest);
    }

    @Delete('doctors/:id')
    async deleteDoctorById(@Param('id') id: number) {
        await this.doctorsService.deleteDoctorById(id);
    }
}
