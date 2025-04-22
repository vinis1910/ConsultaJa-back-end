import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'
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
      return new ResponseDTO(HttpStatus.CREATED, 'Patient created', patient)
    } catch (error) {
      if (error instanceof HttpException) throw error
      else throw new InternalServerErrorException(error.message, 'Unexpected error')
    }
  }
}
