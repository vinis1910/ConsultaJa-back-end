import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { AppointmentsService } from './AppointmentsService'
import { AppointmentsController } from './AppointmentsController'
import { PatientEntity } from 'src/patients/PatientEntity'
import { DoctorEntity } from 'src/doctors/DoctorEntity'

@Module({
  imports: [TypeOrmModule.forFeature([MedicalAppointmentEntity, PatientEntity, DoctorEntity])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
