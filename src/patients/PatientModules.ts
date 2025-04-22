import { Module } from '@nestjs/common'
import { PatientsService } from './PatientServices'
import { PatientsController } from './PatientControllers'
import { PatientEntity } from './PatientEntity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from 'src/users/UserServices'
import { UserEntity } from 'src/users/UserEntity'

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, UserEntity])],
  providers: [PatientsService, UsersService],
  controllers: [PatientsController],
})
export class PatientsModule {}
