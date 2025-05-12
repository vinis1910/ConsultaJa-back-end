import { IsDateString, IsString } from 'class-validator'

export class CreateDoctorDTO {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsDateString()
  birthDate: Date

  @IsString()
  gender: string

  @IsString()
  cpf: string

  @IsString()
  crm: string

  @IsString()
  phone: string

  @IsString()
  crmUf: string
}
