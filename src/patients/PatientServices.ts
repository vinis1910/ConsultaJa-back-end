import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { PatientEntity } from './PatientEntity'
import { DataSource, Repository } from 'typeorm'
import { CreatePatientDTO } from './dto/CreatePatientDTO'
import { UsersService } from 'src/users/UserServices'
import { ReturnCreatedPatientDTO } from './dto/ReturnCreatedPatientDTO'
import { UserEntity } from 'src/users/UserEntity'

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity) private readonly patientRepository: Repository<PatientEntity>,
    private readonly userService: UsersService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createPatient(createPatientDTO: CreatePatientDTO): Promise<ReturnCreatedPatientDTO> {
    return await this.dataSource.transaction(async (manager) => {
      if (!createPatientDTO.name) throw new BadRequestException('Name is a required field.')
      if (!createPatientDTO.phone) throw new BadRequestException('Phone is a required field.')
      if (!createPatientDTO.birthDate) throw new BadRequestException('Birth Date is a required field.')

      const userRepository = manager.getRepository(UserEntity)
      const patientRepository = manager.getRepository(PatientEntity)

      const user = await this.userService.createUser({ email: createPatientDTO.email, password: createPatientDTO.password, role: 'Patient' }, userRepository)

      const patient = await patientRepository.save({
        name: createPatientDTO.name,
        phone: createPatientDTO.phone,
        birthDate: createPatientDTO.birthDate,
        userId: user.id,
      })

      Logger.log(`Patient ${patient.id} successfully created.`)

      return new ReturnCreatedPatientDTO(createPatientDTO.email)
    })
  }
}
