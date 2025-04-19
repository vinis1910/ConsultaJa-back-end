import { Module } from '@nestjs/common';
import { DoctorsService } from './DoctorServices';
import { DoctorsController } from './DoctorControllers';
import { DoctorEntity } from './DoctorEntity';
import { DoctorAvailabilityEntity } from './DoctorAvailabilityEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity, DoctorAvailabilityEntity])],
  providers: [DoctorsService],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
