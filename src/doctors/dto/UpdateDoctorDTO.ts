import { IsOptional, IsString, IsDateString } from 'class-validator'

export class UpdateDoctorDTO {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsDateString()
  birthDate?: Date

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  phone?: string
}
