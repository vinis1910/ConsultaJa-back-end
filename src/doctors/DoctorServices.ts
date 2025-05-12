import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DoctorEntity } from './DoctorEntity'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ReturnCreatedDoctorDTO } from './dto/ReturnCreatedDoctorDTO'
import { UsersService } from 'src/users/UserServices'
import { UserEntity } from 'src/users/UserEntity'
@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userService: UsersService,
  ) {}

  async createDoctor(createDoctorDTO: CreateDoctorDTO): Promise<ReturnCreatedDoctorDTO> {
    if (!createDoctorDTO.firstName) throw new BadRequestException('Primeiro nome é um campo requerido.')
    if (!createDoctorDTO.lastName) throw new BadRequestException('Ultimo é um campo requerido.')
    if (!createDoctorDTO.birthDate) throw new BadRequestException('Data de nascimento é um campo requerido.')
    if (!createDoctorDTO.gender) throw new BadRequestException('Gênero é um campo requerido.')
    if (!createDoctorDTO.cpf) throw new BadRequestException('CPF é um campo requerido.')
    if (!createDoctorDTO.crm) throw new BadRequestException('CRM é um campo requerido.')
    if (!createDoctorDTO.crmUf) throw new BadRequestException('CRM UF é um campo requerido.')
    if (!createDoctorDTO.phone) throw new BadRequestException('Telefone é um campo requerido.')

    if (!this.isValidCPF(createDoctorDTO.cpf)) throw new BadRequestException('CPF não é válido.')
    if (!this.isValidCRM(createDoctorDTO.crm)) throw new BadRequestException('CRM não é válido.')

    const doctor = await this.doctorRepository.findOneBy({ cpf: createDoctorDTO.cpf })
    if (doctor) throw new BadRequestException(`Médico(a) com CPF=${createDoctorDTO.cpf} já existente.`)

    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(UserEntity)
      const doctorRepository = manager.getRepository(DoctorEntity)
      const user = await this.userService.createUser({ email: createDoctorDTO.email, password: createDoctorDTO.password, role: 'Doctor' }, userRepository)

      const savedDoctor = await doctorRepository.save({
        firstName: createDoctorDTO.firstName,
        lastName: createDoctorDTO.lastName,
        birthDate: createDoctorDTO.birthDate,
        gender: createDoctorDTO.gender,
        cpf: createDoctorDTO.cpf,
        crm: createDoctorDTO.crm,
        crmUf: createDoctorDTO.crmUf,
        phone: createDoctorDTO.phone,
        userId: user.id,
      })

      Logger.log(`Doctor ${savedDoctor.id} successfully created.`)

      return new ReturnCreatedDoctorDTO(savedDoctor.id, savedDoctor.firstName, savedDoctor.birthDate, savedDoctor.crm, savedDoctor.crmUf, savedDoctor.phone, user.email)
    })
  }

  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[9])) return false

    sum = 0
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === parseInt(cpf[10])
  }

  private isValidCRM(crm: string): boolean {
    const numericCRM = crm.replace(/[^\d]+/g, '')
    return /^\d{4,6}$/.test(numericCRM)
  }
}
