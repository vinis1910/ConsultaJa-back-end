import { IsOptional, IsString, IsDateString } from 'class-validator'

export class UpdatePatientDTO {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsDateString()
  birthDate?: Date

  @IsOptional()
  @IsString()
  phone?: string
}
