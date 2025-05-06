import { Module } from '@nestjs/common'
import { AppointmentsService } from './AppointmentsService'
import { AppointmentsController } from './AppointmentsController'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([MedicalAppointmentEntity])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
