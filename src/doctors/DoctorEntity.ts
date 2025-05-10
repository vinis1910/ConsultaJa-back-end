import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'name', type: 'varchar' })
  name: string

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date

  @Column({ name: 'gender', type: 'varchar' })
  gender: string

  @Column({ name: 'cpf', type: 'varchar' })
  cpf: string

  @Column({ name: 'crm', type: 'varchar' })
  crm: string

  @Column({ name: 'phone', type: 'varchar' })
  phone: string

  @Column({ name: 'crm_uf', type: 'varchar' })
  crmUf: string

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @Column({ name: 'user_id', type: 'integer' })
  userId: number
}
