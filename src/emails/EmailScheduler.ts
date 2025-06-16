import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MedicalAppointmentEntity } from 'src/appointments/MedicalAppointmentEntity'
import { EmailService } from './EmailService'

@Injectable()
export class EmailScheduler {
  constructor(
    @InjectRepository(MedicalAppointmentEntity)
    private appointmentRepository: Repository<MedicalAppointmentEntity>,
    private readonly emailService: EmailService,
  ) {}
  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    Logger.log('Running cron to remind patients about the appointment...')
    const now = new Date()
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    start.setMinutes(0, 0, 0)
    const end = new Date(start)
    end.setHours(start.getHours() + 1, 0, 0, 0)

    const appointments = await this.appointmentRepository.find({
      where: {
        date: Between(start, end),
      },
      relations: ['patient.user', 'doctor'],
    })

    Logger.log(`${appointments.length} appointments were found to remind patients.`)

    for (const appointment of appointments) {
      const formattedDate = format(appointment.date, 'dd/MM/yyyy', { locale: ptBR })
      const formattedTime = format(appointment.date, 'HH:mm')

      const html = this.emailService.generateAppointmentReminderTemplate(appointment.patient.firstName, appointment.doctor.firstName, formattedDate, formattedTime)

      await this.emailService.sendEmail(appointment.patient.user.email, '⏰ Lembrete de Consulta - ConsultaJá', html)

      Logger.log(`Lembrete enviado para ${appointment.patient.user.email}`)
    }
  }
}
