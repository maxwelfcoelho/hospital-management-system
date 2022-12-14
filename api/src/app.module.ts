import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import {Role} from './role/role.entity';
import {RolesModule} from './role/roles.module';
import {Doctor} from './user/doctor/doctor.entity';
import { DoctorsModule } from './user/doctor/doctors.module';
import { User } from './user/user.entity';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Role, Doctor],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DoctorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
