import { HttpStatus } from '@nestjs/common'

export class ResponseDTO {
  constructor(statusCode: HttpStatus, message: string, data?: any) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
  statusCode: HttpStatus
  message: string
  data: any
}
