import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common'
import { DoctorsService } from './DoctorServices'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ReturnCreatedDoctorDTO } from './dto/ReturnCreatedDoctorDTO'

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async createDoctor(@Body() createDoctorDTO: CreateDoctorDTO): Promise<ReturnCreatedDoctorDTO> {
    try {
      const doctor = await this.doctorsService.createDoctor(createDoctorDTO)
      return doctor
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }
}
