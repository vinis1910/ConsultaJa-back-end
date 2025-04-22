import { Module } from '@nestjs/common';
import { PatientsService } from './PatientServices';
import { PatientsController } from './PatientControllers';
import { PatientEntity } from './PatientEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
