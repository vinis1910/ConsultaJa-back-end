import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ResponseDTO } from 'src/utils/ReponseDTO'
import { AttachmentsService } from './AttachmentsService'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('doctorId') doctorId: string, @Body('patientId') patientId: string) {
    try {
      const document = await this.attachmentsService.uploadFile(file, Number(doctorId), Number(patientId))
      return new ResponseDTO(HttpStatus.CREATED, 'Documento salvo com sucesso.', document)
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message, 'Erro inesperado')
      }
      throw new InternalServerErrorException('Erro inesperado')
    }
  }
}
