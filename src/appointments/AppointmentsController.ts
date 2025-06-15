import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Patch, Post, Param, ParseIntPipe, UseGuards, Query, Get } from '@nestjs/common'
import { AppointmentsService } from './AppointmentsService'
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { JwtAuthGuard } from 'src/auth/guards/JWTAuthGuard'
import { RescheduleAppointmentDTO } from './dto/RescheduleAppointmentDTO'
import { BadRequestException } from '@nestjs/common'
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDTO: CreateAppointmentDTO): Promise<ResponseDTO> {
    try {
      const appointment = await this.appointmentsService.createAppointment(createAppointmentDTO)
      return new ResponseDTO(HttpStatus.CREATED, 'Consulta Criada', appointment)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }

  @Get()
  async getDoctorsAppointments(@Query('doctorId') doctorId: number, @Query('date') date: string): Promise<ResponseDTO> {
    try {
      const appointments = await this.appointmentsService.getDoctorAppointments(doctorId, date)
      return new ResponseDTO(HttpStatus.CREATED, `Horários do dia ${date} para o doutor=${doctorId}`, appointments)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }

  @Get('availability/:doctorId')
  async getDoctorAvailability(@Param('doctorId', ParseIntPipe) doctorId: number, @Query('date') date?: string, @Query('weekday') weekday?: string): Promise<ResponseDTO> {
    try {
      if (!date && !weekday) {
        // Nenhum filtro → OK → service trata isso como "agenda completa"
      } else if (date && isNaN(Date.parse(date))) {
        throw new BadRequestException('O parâmetro "date" deve estar no formato YYYY-MM-DD.')
      }

      const result: unknown = await this.appointmentsService.getDoctorAvailabilityFlexible(doctorId, date, weekday)

      return new ResponseDTO(HttpStatus.OK, 'Disponibilidade recuperada com sucesso.', result)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }

  @Patch(':id/cancel')
  async cancelAppointment(@Param('id', ParseIntPipe) appointmentId: number): Promise<ResponseDTO> {
    try {
      await this.appointmentsService.cancelAppointment(appointmentId)
      return new ResponseDTO(HttpStatus.OK, 'Consulta Cancelada com sucesso', null)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }
  @Patch(':id/reschedule')
  async reschedule(@Param('id', ParseIntPipe) id: number, @Body() rescheduleDTO: RescheduleAppointmentDTO): Promise<ResponseDTO> {
    try {
      const updatedAppointment = await this.appointmentsService.rescheduleAppointment(id, rescheduleDTO)
      return new ResponseDTO(HttpStatus.OK, 'Consulta remarcada com sucesso.', updatedAppointment)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Unexpected error')
      }
      throw new InternalServerErrorException('Unexpected error')
    }
  }
}
