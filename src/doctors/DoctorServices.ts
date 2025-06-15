import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { DataSource, FindOptionsWhere, Like, Repository } from 'typeorm'
import { DoctorEntity } from './DoctorEntity'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ReturnCreatedDoctorDTO } from './dto/ReturnCreatedDoctorDTO'
import { UsersService } from 'src/users/UserServices'
import { UserEntity } from 'src/users/UserEntity'
import { instanceToPlain } from 'class-transformer'
import { SpecializationEntity } from './SpecializationEntity'
import { CreateConfigDaysDTO } from './dto/CreateConfigDaysDTO'
import { DoctorAvailabilityEntity } from './DoctorAvailabilityEntity'
import { UpdateDoctorDTO } from './dto/UpdateDoctorDTO'
import { SearchDoctorDTO } from './dto/SearchDoctorDTO'

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(SpecializationEntity)
    private readonly specializationRepository: Repository<SpecializationEntity>,
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
    if (!createDoctorDTO.specialization) throw new BadRequestException('Especialização é um campo requerido.')

    if (!this.isValidCPF(createDoctorDTO.cpf)) throw new BadRequestException('CPF não é válido.')
    if (!this.isValidCRM(createDoctorDTO.crm)) throw new BadRequestException('CRM não é válido.')

    const doctor = await this.doctorRepository.findOneBy({ cpf: createDoctorDTO.cpf })
    if (doctor) throw new BadRequestException(`Médico(a) com CPF=${createDoctorDTO.cpf} já existente.`)

    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(UserEntity)
      const doctorRepository = manager.getRepository(DoctorEntity)
      const specializationEntity = manager.getRepository(SpecializationEntity)

      const user = await this.userService.createUser({ email: createDoctorDTO.email, password: createDoctorDTO.password, role: 'Doctor' }, userRepository)

      const specialization = await specializationEntity.findOneBy({ name: createDoctorDTO.specialization })
      if (!specialization) throw new BadRequestException('Especialização não é existente.')

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
        specializationId: specialization.id,
      })

      Logger.log(`Doctor ${savedDoctor.id} successfully created.`)

      return new ReturnCreatedDoctorDTO(savedDoctor.id, savedDoctor.firstName, savedDoctor.birthDate, savedDoctor.crm, savedDoctor.crmUf, savedDoctor.phone, user.email)
    })
  }

  async getDoctor(userId: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { userId: userId },
      relations: ['user'],
    })
    if (!doctor) throw new BadRequestException(`Médico(a) com userID=${userId} não existe.`)
    return instanceToPlain(doctor) as DoctorEntity
  }

  async createDoctorConfigDays(dto: Array<CreateConfigDaysDTO>) {
    return await this.dataSource.transaction(async (manager) => {
      const doctorAvailabilityRepository = manager.getRepository(DoctorAvailabilityEntity)
      const doctorRespository = manager.getRepository(DoctorEntity)

      const doctor = await doctorRespository.findOne({ where: { userId: dto[0].userId } })
      if (!doctor) throw new BadRequestException(`Médico(a) com userID=${dto[0].userId} não existe.`)

      doctorAvailabilityRepository.delete({ doctorId: doctor.id })
      const availability: Partial<DoctorAvailabilityEntity>[] = dto.map((it) => ({
        weekday: it.day,
        startTime: it.startTime,
        endTime: it.endTime,
        slotInterval: it.interval,
        doctorId: doctor.id,
      }))

      return await doctorAvailabilityRepository.save(availability)
    })
  }

  async updateDoctor(id: number, updateDTO: UpdateDoctorDTO): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOneBy({ id })
    if (!doctor) throw new BadRequestException(`Médico com ID=${id} não encontrado.`)
    Object.assign(doctor, updateDTO)
    const updatedDoctor = await this.doctorRepository.save(doctor)
    return updatedDoctor
  }

  async listDoctors(filter: SearchDoctorDTO): Promise<DoctorEntity[]> {
    const query = this.doctorRepository.createQueryBuilder('doctor').leftJoinAndSelect('doctor.address', 'address')

    const specialization = await this.specializationRepository.findOne({ where: { name: filter.specialization } })
    if (!specialization) throw new BadRequestException(`especialização não encontrada.`)

    if (filter.specialization) {
      query.andWhere('doctor.specializationId = :specialization', {
        specialization: specialization.id,
      })
    }
    if (filter.city) query.andWhere('address.city ILIKE :city', { city: `%${filter.city}%` })

    return await query.getMany()
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 8)
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
