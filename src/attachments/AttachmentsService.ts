import { Injectable, Logger } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AttachmentsEntity } from './AttachmentsEntity'

@Injectable()
export class AttachmentsService {
  private readonly s3: S3Client
  private readonly bucket: string | undefined

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AttachmentsEntity) private readonly attachmentRepository: Repository<AttachmentsEntity>,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: fromEnv(),
    })

    this.bucket = this.configService.get<string>('AWS_BUCKET_NAME')
  }

  async uploadFile(file: Express.Multer.File, doctorId: number, patientId: number) {
    const key = `uploads/${uuid()}-${file.originalname}-${new Date().toISOString()}`
    await this.attachmentRepository.save({ awsKey: file.originalname, doctorId: doctorId, patientId: patientId })

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    try {
      await this.s3.send(command)
      return {
        url: `https://${this.bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`,
        key,
      }
    } catch (error) {
      Logger.error('Error while sending file to S3', error)
      throw error
    }
  }
}
