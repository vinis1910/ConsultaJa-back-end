import { IsDate, IsDateString, IsString } from 'class-validator'

export class CreatePatientDTO {
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
  phone: string
}
