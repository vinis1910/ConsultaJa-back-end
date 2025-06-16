import { IsDateString, IsString } from 'class-validator'

export class RescheduleAppointmentDTO {
  @IsDateString()
  newDate: Date

  @IsString()
  newStartTime: string

  @IsString()
  newEndTime: string
}
