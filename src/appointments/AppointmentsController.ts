import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'
import { AppointmentsService } from './AppointmentsService'
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDTO: CreateAppointmentDTO): Promise<ResponseDTO> {
    try {
      const appointment = await this.appointmentsService.createAppointment(createAppointmentDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'Appointment created', appointment)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }
}
