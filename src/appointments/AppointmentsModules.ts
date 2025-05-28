import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { AppointmentsService } from './AppointmentsService'
import { AppointmentsController } from './AppointmentsController'
import { PatientEntity } from 'src/patients/PatientEntity'
import { DoctorEntity } from 'src/doctors/DoctorEntity'
import { DoctorAvailabilityEntity } from 'src/doctors/DoctorAvailabilityEntity'

@Module({
  imports: [TypeOrmModule.forFeature([MedicalAppointmentEntity, PatientEntity, DoctorEntity, DoctorAvailabilityEntity])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
