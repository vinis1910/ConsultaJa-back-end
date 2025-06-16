import { Module } from '@nestjs/common'
import { AttachmentsService } from './AttachmentsService'
import { AttachmentsController as AttachmentsController } from './AttachmentsController'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttachmentsEntity } from './AttachmentsEntity'

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentsEntity])],
  providers: [AttachmentsService],
  controllers: [AttachmentsController],
})
export class AttachmentsModule {}
