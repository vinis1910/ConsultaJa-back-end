import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('medical_appointment')
export class MedicalAppointmentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'date', type: 'timestamp' })
  date: Date

  @Column({ name: 'status', type: 'varchar' })
  status: string

  @Column({ name: 'price', type: 'numeric' })
  price: number

  @Column({ name: 'patient_id', type: 'integer' })
  patientId: number

  @Column({ name: 'doctor_id', type: 'integer' })
  doctorId: number

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date
}
