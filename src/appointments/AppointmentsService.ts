import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO'
import { ReturnCreatedAppointmentDTO } from './dto/ReturnCreatedAppointmentDTO'
import { PatientEntity } from 'src/patients/PatientEntity'
import { DoctorEntity } from 'src/doctors/DoctorEntity'
import { AppointmentStatus } from './AppointmetsStatus'
import { parse, format, addMinutes } from 'date-fns'
import { DoctorAvailabilityEntity } from 'src/doctors/DoctorAvailabilityEntity'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(MedicalAppointmentEntity)
    private readonly appointmentRepository: Repository<MedicalAppointmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(DoctorAvailabilityEntity)
    private readonly doctorAvailabilityRepository: Repository<DoctorAvailabilityEntity>,
  ) {}

  async createAppointment(dto: CreateAppointmentDTO): Promise<ReturnCreatedAppointmentDTO> {
    const doctor = await this.doctorRepository.findOneBy({ id: dto.doctorId })
    if (!doctor) throw new BadRequestException('Médico não encontrado.')

    const patient = await this.patientRepository.findOneBy({ id: dto.patientId })
    if (!patient) throw new BadRequestException('Paciente não encontrado.')

    const { doctorId, date, startTime: startTimeStr } = dto

    const dateMidnight = new Date(`${date}T00:00`)
    const weekday = format(dateMidnight, 'eeee').toLowerCase()

    const scheduleDay = await this.doctorAvailabilityRepository.findOne({
      where: { doctorId: doctorId, weekday: weekday },
    })
    if (!scheduleDay) throw new BadRequestException('Agenda do médico não está configurada para esse dia.')

    const start = this.combineDateAndTimeFromTimeString(date, startTimeStr)
    const end = addMinutes(start, scheduleDay.slotInterval)

    const scheduleStart = this.combineDateAndTimeFromTimeString(date, scheduleDay.startTime as unknown as string)
    const scheduleEnd = this.combineDateAndTimeFromTimeString(date, scheduleDay.endTime as unknown as string)

    const withinSchedule = start >= scheduleStart && end <= scheduleEnd
    if (!withinSchedule) throw new BadRequestException('Horário fora do expediente do médico.')

    const conflict = await this.appointmentRepository.findOne({
      where: {
        doctorId: dto.doctorId,
        date: new Date(`${date}T00:00`),
        startTime: start,
        status: AppointmentStatus.SCHEDULED,
      },
    })

    if (conflict) throw new BadRequestException('Horário já ocupado.')

    const newAppointment = await this.appointmentRepository.save({
      doctorId: dto.doctorId,
      patientId: dto.patientId,
      date: new Date(`${date}T00:00`),
      startTime: start,
      endTime: end,
      status: AppointmentStatus.SCHEDULED,
      createdAt: new Date(),
    })

    const returnDTP = new ReturnCreatedAppointmentDTO(newAppointment.startTime, newAppointment.endTime, newAppointment.date, doctor.firstName, patient.firstName)

    return returnDTP
  }

  combineDateAndTimeFromTimeString(dateStr: string, timeStr: string): Date {
    if (typeof timeStr !== 'string') throw new Error('Horário inválido (esperado string HH:mm:ss)')

    const [year, month, day] = dateStr.split('-').map(Number)
    const [hour, minute, second] = timeStr.split(':').map(Number)

    const date = new Date()
    date.setFullYear(year)
    date.setMonth(month - 1)
    date.setDate(day)
    date.setHours(hour)
    date.setMinutes(minute)
    date.setSeconds(second || 0)
    date.setMilliseconds(0)

    return date
  }

  async cancelAppointment(appointmentId: number): Promise<void> {
    const appointment = await this.appointmentRepository.findOneBy({ id: appointmentId })
    if (!appointment) throw new BadRequestException(`Consulta com ID=${appointmentId} não existe.`)

    if (appointment.status === AppointmentStatus.CANCELED) throw new BadRequestException(`Consulta com ID=${appointmentId} já está cancelada.`)
    if (appointment.status === AppointmentStatus.COMPLETED) throw new BadRequestException(`Consulta com ID=${appointmentId} já foi concluída.`)
    if (new Date(appointment.date) < new Date()) throw new BadRequestException(`Consulta com ID=${appointmentId} já passou.`)
  }
}
