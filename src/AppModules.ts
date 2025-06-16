import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/AuthModules'
import { UsersModule } from './users/UserModules'
import { PatientsModule } from './patients/PatientModules'
import { DoctorsModule } from './doctors/DoctorModules'
import { AppointmentsModule } from './appointments/AppointmentsModules'
import { ChatsModule } from './chats/ChatMessageModules'
import { Database } from './configs/DatabaseConfiguration'
import { AttachmentsModule } from './attachments/AttachmentsModules'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    Database,
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    ChatsModule,
    AttachmentsModule,
  ],
})
export class AppModule {}
