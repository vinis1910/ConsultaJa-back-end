import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, ParseIntPipe, Param } from '@nestjs/common'
import { CreatePatientDTO } from 'src/patients/dto/CreatePatientDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { PatientsService } from './PatientServices'

@Controller('patient')
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}
  @Post()
  async create(@Body() createPatientDTO: CreatePatientDTO): Promise<ResponseDTO> {
    try {
      const patient = await this.patientService.createPatient(createPatientDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'Paciente criado', patient)
    } catch (error) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }

  @Get(':id')
  async getPatient(@Param('id', ParseIntPipe) patientId: number): Promise<ResponseDTO> {
    try {
      const patient = await this.patientService.getPatient(patientId)
      return new ResponseDTO(HttpStatus.OK, 'Paciente encontrado', patient)
    } catch (error) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
}
