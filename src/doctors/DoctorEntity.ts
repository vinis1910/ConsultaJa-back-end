import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from 'src/users/UserEntity'

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string

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

  @Column({ name: 'user_id', type: 'integer' })
  userId: number

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column({ name: 'specialization_id', type: 'integer' })
  specializationId: number
}
