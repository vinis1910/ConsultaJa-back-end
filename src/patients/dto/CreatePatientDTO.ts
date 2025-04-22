import { IsDate, IsDateString, IsString } from 'class-validator'

export class CreatePatientDTO {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsString()
  name: string

  @IsDateString()
  birthDate: Date

  @IsString()
  gender: string

  @IsString()
  phone: string

  @IsString()
  cpf: string
}
