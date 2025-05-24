import { IsNumber, IsDateString, Matches } from 'class-validator'

export class CreateAppointmentDTO {
  @IsDateString()
  date: string

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string

  @IsNumber()
  patientId: number

  @IsNumber()
  doctorId: number
}
