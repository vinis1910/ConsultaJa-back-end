import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('medical_specialization')
export class SpecializationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'name', type: 'varchar' })
  name: string
}
