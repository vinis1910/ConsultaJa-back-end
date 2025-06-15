import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'street', type: 'varchar' })
  street: string

  @Column({ name: 'number', type: 'integer' })
  number: string

  @Column({ name: 'complement', type: 'integer', nullable: true })
  complement?: string

  @Column({ name: 'neighborhood', type: 'varchar' })
  neighborhood: string

  @Column({ name: 'city', type: 'varchar' })
  city: string

  @Column({ name: 'state', type: 'varchar' })
  state: string

  @Column({ name: 'postal_code', type: 'varchar' })
  postalCode: string
}
