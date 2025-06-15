import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, ParseIntPipe, Param, Patch, UseGuards } from '@nestjs/common'
import { CreatePatientDTO } from 'src/patients/dto/CreatePatientDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { PatientsService } from './PatientServices'
import { UpdatePatientDTO } from './dto/UpdatePatientDTO'
import { JwtAuthGuard } from 'src/auth/guards/JWTAuthGuard'

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
  async getPatient(@Param('id', ParseIntPipe) userId: number): Promise<ResponseDTO> {
    try {
      const patient = await this.patientService.getPatient(userId)
      return new ResponseDTO(HttpStatus.OK, 'Paciente encontrado', patient)
    } catch (error) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDTO: UpdatePatientDTO): Promise<ResponseDTO> {
    try {
      const updatedPatient = await this.patientService.updatePatient(id, updateDTO)
      return new ResponseDTO(HttpStatus.OK, 'Paciente atualizado com sucesso.', updatedPatient)
    } catch (error) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
}
