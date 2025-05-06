import { IsNumber, IsString, IsDateString } from 'class-validator'

export class CreateAppointmentDTO {
  @IsDateString()
  date: Date

  @IsString()
  status: string

  @IsNumber()
  price: number

  @IsNumber()
  patientId: number

  @IsNumber()
  doctorId: number

  @IsString()
  reason: string

  @IsString()
  anamnese: string

  @IsString()
  diagnostic: string
}
