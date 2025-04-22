import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'email', type: 'varchar' })
  email: string

  @Column({ name: 'password', type: 'varchar' })
  password: string

  @Column({ name: 'role', type: 'varchar' })
  role: string

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date
}
