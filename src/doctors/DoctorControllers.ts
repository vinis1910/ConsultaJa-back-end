import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'
import { DoctorsService } from './DoctorServices'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDTO: CreateDoctorDTO): Promise<ResponseDTO> {
    try {
      const doctor = await this.doctorsService.createDoctor(createDoctorDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'Doctor created', doctor)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }
}
