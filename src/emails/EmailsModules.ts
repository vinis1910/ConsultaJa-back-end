import { Module } from '@nestjs/common'
import { EmailsController } from './EmailsControllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailScheduler } from './EmailScheduler'
import { EmailService } from './EmailService'
import { MedicalAppointmentEntity } from 'src/appointments/MedicalAppointmentEntity'

@Module({
  imports: [TypeOrmModule.forFeature([MedicalAppointmentEntity])],
  providers: [EmailScheduler, EmailService],
  controllers: [EmailsController],
})
export class EmailsModule {}
