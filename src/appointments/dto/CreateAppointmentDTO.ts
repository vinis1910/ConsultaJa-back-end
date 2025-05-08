import { IsNumber, IsDateString } from 'class-validator'

export class CreateAppointmentDTO {
  @IsDateString()
  date: Date

  @IsNumber()
  price: number

  @IsNumber()
  patientId: number

  @IsNumber()
  doctorId: number
}
