import { IsOptional, IsString } from 'class-validator'

export class SearchDoctorDTO {
  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  specialization?: string
}
