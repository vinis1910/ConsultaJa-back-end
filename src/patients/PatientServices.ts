import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PatientEntity } from './PatientEntity'
import { Repository } from 'typeorm'
import { CreatePatientDTO } from './dto/CreatePatientDTO'
import { UsersService } from 'src/users/UserServices'
import { ReturnCreatedPatientDTO } from './dto/ReturnCreatedPatientDTO'

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity) private readonly patientRepository: Repository<PatientEntity>,
    private readonly userService: UsersService,
  ) {}

  async createPatient(createPatientDTO: CreatePatientDTO): Promise<ReturnCreatedPatientDTO> {
    if (!createPatientDTO.name) throw new BadRequestException('Name is a required field.')
    if (!createPatientDTO.phone) throw new BadRequestException('Phone is a required field.')
    if (!createPatientDTO.gender) throw new BadRequestException('Gender is a required field.')
    if (!createPatientDTO.cpf) throw new BadRequestException('CPF is a required field.')
    if (!createPatientDTO.birthDate) throw new BadRequestException('Birth Date is a required field.')
    if (!this.isValidCPF(createPatientDTO.cpf)) throw new BadRequestException('CPF is not valid.')

    const patientExists = await this.patientRepository.findOneBy({ cpf: createPatientDTO.cpf })
    if (patientExists) throw new BadRequestException(`Paciente com CPF=${createPatientDTO.cpf} já existente.`)

    const user = await this.userService.createUser({ email: createPatientDTO.email, password: createPatientDTO.password, role: 'Patient' })

    const createdPatient = await this.patientRepository.save({
      name: createPatientDTO.name,
      phone: createPatientDTO.phone,
      birthDate: createPatientDTO.birthDate,
      cpf: createPatientDTO.cpf,
      gender: createPatientDTO.gender,
      userId: user.id,
    })

    return new ReturnCreatedPatientDTO(createPatientDTO.email)
  }

  isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '')

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false
    }

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf[i - 1]) * (11 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[9])) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf[i - 1]) * (12 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[10])) return false

    return true
  }
}
