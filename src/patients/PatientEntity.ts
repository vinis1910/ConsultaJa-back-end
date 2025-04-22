import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;
}
