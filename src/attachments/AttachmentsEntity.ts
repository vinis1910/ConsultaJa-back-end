import { DoctorEntity } from 'src/doctors/DoctorEntity'
import { PatientEntity } from 'src/patients/PatientEntity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('attachments')
export class AttachmentsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'aws_key', type: 'varchar' })
  awsKey: string

  @Column({ name: 'patient_id', type: 'integer' })
  patientId: number

  @Column({ name: 'doctor_id', type: 'integer' })
  doctorId: number

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity
}
