import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DoctorEntity } from './DoctorEntity'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ReturnCreatedDoctorDTO } from './dto/ReturnCreatedDoctorDTO'
import { UserEntity } from 'src/users/UserEntity'
@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createDoctor(createDoctorDTO: CreateDoctorDTO): Promise<ReturnCreatedDoctorDTO> {
    if (!createDoctorDTO.name) throw new BadRequestException('Name is a required field.')
    if (!createDoctorDTO.birthDate) throw new BadRequestException('Birth Date is a required field.')
    if (!createDoctorDTO.gender) throw new BadRequestException('Gender is a required field.')
    if (!createDoctorDTO.cpf) throw new BadRequestException('CPF is a required field.')
    if (!createDoctorDTO.crm) throw new BadRequestException('CRM is a required field.')
    if (!createDoctorDTO.crmUf) throw new BadRequestException('CRM UF is a required field.')
    if (!createDoctorDTO.phone) throw new BadRequestException('Phone is a required field.')

    if (!this.isValidCPF(createDoctorDTO.cpf)) throw new BadRequestException('CPF is not valid.')
    if (!this.isValidCRM(createDoctorDTO.crm)) throw new BadRequestException('CRM is not valid.')

    const doctorWithCpf = await this.doctorRepository.findOneBy({ cpf: createDoctorDTO.cpf })
    if (doctorWithCpf) throw new BadRequestException(`Médico com CPF=${createDoctorDTO.cpf} já existente.`)

    return await this.dataSource.transaction(async (manager) => {
      const user = manager.create(UserEntity, { email: createDoctorDTO.email, password: createDoctorDTO.password, role: 'Doctor' })

      const doctor = manager.create(DoctorEntity, {
        name: createDoctorDTO.name,
        birthDate: createDoctorDTO.birthDate,
        gender: createDoctorDTO.gender,
        cpf: createDoctorDTO.cpf,
        crm: createDoctorDTO.crm,
        crmUf: createDoctorDTO.crmUf,
        phone: createDoctorDTO.phone,
        userId: user.id,
        createdAt: new Date(),
      })

      const savedDoctor = await manager.save(doctor)

      return new ReturnCreatedDoctorDTO(savedDoctor.id, savedDoctor.name, savedDoctor.birthDate, savedDoctor.crm, savedDoctor.crmUf, savedDoctor.phone, user.email)
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
