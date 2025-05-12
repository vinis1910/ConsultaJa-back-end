import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO'
import { ReturnCreatedAppointmentDTO } from './dto/ReturnCreatedAppointmentDTO'
import { PatientEntity } from 'src/patients/PatientEntity'
import { DoctorEntity } from 'src/doctors/DoctorEntity'
import { AppointmentStatus } from './AppointmetsStatus'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(MedicalAppointmentEntity)
    private readonly appointmentRepository: Repository<MedicalAppointmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  async createAppointment(createAppointmentDTO: CreateAppointmentDTO): Promise<ReturnCreatedAppointmentDTO> {
    if (!createAppointmentDTO.date || new Date(createAppointmentDTO.date) < new Date()) throw new BadRequestException('A data é um campo requerido ou precisa ser maior que a data atual.')
    if (createAppointmentDTO.price == undefined || createAppointmentDTO.price < 0) throw new BadRequestException('O preço não pode ser menor que zero.')
    if (!createAppointmentDTO.patientId) throw new BadRequestException('O campo paciente é requerido.')
    if (!createAppointmentDTO.doctorId) throw new BadRequestException('O campo médico é requerido.')

    const patient = await this.patientRepository.findOneBy({ id: createAppointmentDTO.patientId })
    if (!patient) throw new BadRequestException(`Paciente com ID=${createAppointmentDTO.patientId} não existe.`)

    const doctor = await this.doctorRepository.findOneBy({ id: createAppointmentDTO.doctorId })
    if (!doctor) throw new BadRequestException(`Médico com ID=${createAppointmentDTO.doctorId} não existe.`)

    const appointment = this.appointmentRepository.create({
      date: createAppointmentDTO.date,
      status: AppointmentStatus.SCHEDULED,
      price: createAppointmentDTO.price,
      patientId: createAppointmentDTO.patientId,
      doctorId: createAppointmentDTO.doctorId,
      createdAt: new Date(),
    })

    const savedAppointment = await this.appointmentRepository.save(appointment)

    return new ReturnCreatedAppointmentDTO(new Date(savedAppointment.date).toISOString(), Number(savedAppointment.price), doctor.firstName, patient.firstName)
  }
}
