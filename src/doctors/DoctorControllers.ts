import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, ParseIntPipe, Param, Patch, Query } from '@nestjs/common'
import { DoctorsService } from './DoctorServices'
import { CreateDoctorDTO } from './dto/CreateDoctorDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { CreateConfigDaysDTO } from './dto/CreateConfigDaysDTO'
import { UpdateDoctorDTO } from './dto/UpdateDoctorDTO'
import { SearchDoctorDTO } from './dto/SearchDoctorDTO'

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDTO: CreateDoctorDTO): Promise<ResponseDTO> {
    try {
      const doctor = await this.doctorsService.createDoctor(createDoctorDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'Médico criado', doctor)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }

  @Get(':id')
  async getDoctor(@Param('id', ParseIntPipe) userId: number): Promise<ResponseDTO> {
    try {
      const doctor = await this.doctorsService.getDoctor(userId)
      return new ResponseDTO(HttpStatus.OK, 'Médico encontrado', doctor)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }

  @Post('config-availability')
  async createDoctorAvailability(@Body() dto: Array<CreateConfigDaysDTO>): Promise<ResponseDTO> {
    try {
      const availability = await this.doctorsService.createDoctorConfigDays(dto)
      return new ResponseDTO(HttpStatus.CREATED, 'Configuração de horário criada com sucesso', availability)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDTO: UpdateDoctorDTO): Promise<ResponseDTO> {
    try {
      const updatedDoctor = await this.doctorsService.updateDoctor(id, updateDTO)
      return new ResponseDTO(HttpStatus.OK, 'Médico atualizado com sucesso.', updatedDoctor)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }

  @Get()
  async listDoctors(@Query() query: SearchDoctorDTO): Promise<ResponseDTO> {
    try {
      const doctosList = await this.doctorsService.listDoctors(query)
      return new ResponseDTO(HttpStatus.OK, 'Médicos listados com sucesso.', doctosList)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
}
