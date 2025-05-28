import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('doctor_availability')
export class DoctorAvailabilityEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'weekday', type: 'varchar' })
  weekday: string

  @Column({ name: 'start_time', type: 'time' })
  startTime: string

  @Column({ name: 'end_time', type: 'time' })
  endTime: string

  @Column({ name: 'slot_interval', type: 'integer' })
  slotInterval: number

  @Column({ name: 'doctor_id', type: 'integer' })
  doctorId: number
}
