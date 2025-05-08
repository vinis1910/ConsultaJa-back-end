import { Module } from '@nestjs/common'
import { DoctorsService } from './DoctorServices'
import { DoctorsController } from './DoctorControllers'
import { DoctorEntity } from './DoctorEntity'
import { UserEntity } from 'src/users/UserEntity'
import { UsersService } from 'src/users/UserServices'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity, UserEntity])],
  providers: [DoctorsService, UsersService],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
