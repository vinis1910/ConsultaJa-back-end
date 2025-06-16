import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AppointmentStatus } from './AppointmetsStatus'
import { DoctorEntity } from 'src/doctors/DoctorEntity'
import { PatientEntity } from 'src/patients/PatientEntity'

@Entity('medical_appointment')
export class MedicalAppointmentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'date', type: 'date' })
  date: Date

  @Column({ name: 'start_at', type: 'timestamp' })
  startTime: Date

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date

  @Column({ name: 'status', type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status: AppointmentStatus

  @Column({ name: 'price', type: 'numeric' })
  price?: number

  @Column({ name: 'patient_id', type: 'integer' })
  patientId: number

  @Column({ name: 'doctor_id', type: 'integer' })
  doctorId: number

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @OneToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity

  @OneToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity
}
