import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { PatientEntity } from './PatientEntity'
import { DataSource, Repository } from 'typeorm'
import { CreatePatientDTO } from './dto/CreatePatientDTO'
import { UsersService } from 'src/users/UserServices'
import { ReturnCreatedPatientDTO } from './dto/ReturnCreatedPatientDTO'
import { UserEntity } from 'src/users/UserEntity'
import { instanceToPlain } from 'class-transformer'
import { UpdatePatientDTO } from './dto/UpdatePatientDTO'

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    private readonly userService: UsersService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createPatient(createPatientDTO: CreatePatientDTO): Promise<ReturnCreatedPatientDTO> {
    return await this.dataSource.transaction(async (manager) => {
      if (!createPatientDTO.firstName) throw new BadRequestException('Primeiro nome é um campo requerido.')
      if (!createPatientDTO.lastName) throw new BadRequestException('Ultimo é um campo requerido.')
      if (!createPatientDTO.phone) throw new BadRequestException('Telefone é um campo requerido.')
      if (!createPatientDTO.birthDate) throw new BadRequestException('Data de nascimento é um campo requerido.')

      const userRepository = manager.getRepository(UserEntity)
      const patientRepository = manager.getRepository(PatientEntity)

      const user = await this.userService.createUser({ email: createPatientDTO.email, password: createPatientDTO.password, role: 'Patient' }, userRepository)

      const patient = await patientRepository.save({
        firstName: createPatientDTO.firstName,
        lastName: createPatientDTO.lastName,
        phone: createPatientDTO.phone,
        birthDate: createPatientDTO.birthDate,
        userId: user.id,
      })

      Logger.log(`Patient ${patient.id} successfully created.`)

      return new ReturnCreatedPatientDTO(createPatientDTO.email)
    })
  }

  async getPatient(userId: number): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOne({
      where: { userId: userId },
      relations: ['user'],
    })
    if (!patient) throw new BadRequestException(`Paciente com userId=${userId} não existe.`)
    return instanceToPlain(patient) as PatientEntity
  }

  async updatePatient(id: number, updateDTO: UpdatePatientDTO): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({ id })

    if (!patient) {
      throw new BadRequestException(`Paciente com ID=${id} não encontrado.`)
    }

    Object.assign(patient, updateDTO)

    const updatedPatient = await this.patientRepository.save(patient)

    return updatedPatient
  }
}
