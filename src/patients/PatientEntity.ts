import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string

  @Column({ name: 'phone', type: 'varchar' })
  phone: string

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date

  @Column({ name: 'user_id', type: 'integer' })
  userId: number
}
