import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MedicalAppointmentEntity } from './MedicalAppointmentEntity'
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO'
import { ReturnCreatedAppointmentDTO } from './dto/ReturnCreatedAppointmentDTO'
import { PatientEntity } from 'src/patients/PatientEntity'
import { DoctorEntity } from 'src/doctors/DoctorEntity'

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
    if (!createAppointmentDTO.date) throw new BadRequestException('Date is a required field.')
    if (!createAppointmentDTO.status) throw new BadRequestException('Status is a required field.')
    if (!createAppointmentDTO.price || createAppointmentDTO.price <= 0) throw new BadRequestException('Price must be greater than zero.')
    if (!createAppointmentDTO.patientId) throw new BadRequestException('Patient ID is a required field.')
    if (!createAppointmentDTO.doctorId) throw new BadRequestException('Doctor ID is a required field.')

    const patientExists = await this.patientRepository.findOneBy({ id: createAppointmentDTO.patientId })
    if (!patientExists) throw new BadRequestException(`Paciente com ID=${createAppointmentDTO.patientId} não existe.`)

    const doctorExists = await this.doctorRepository.findOneBy({ id: createAppointmentDTO.doctorId })
    if (!doctorExists) throw new BadRequestException(`Médico com ID=${createAppointmentDTO.doctorId} não existe.`)

    const appointment = this.appointmentRepository.create({
      date: createAppointmentDTO.date,
      status: createAppointmentDTO.status,
      price: createAppointmentDTO.price,
      patientId: createAppointmentDTO.patientId,
      doctorId: createAppointmentDTO.doctorId,
      createdAt: new Date(),
    })

    const savedAppointment = await this.appointmentRepository.save(appointment)

    return new ReturnCreatedAppointmentDTO(savedAppointment.date.toISOString(), savedAppointment.status, Number(savedAppointment.price), savedAppointment.patientId, savedAppointment.doctorId)
  }
}
