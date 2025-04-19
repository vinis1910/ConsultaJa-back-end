import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message_chat')
export class MedicalRecordEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'reason', type: 'varchar' })
  reason: string;

  @Column({ name: 'anamnese', type: 'varchar' })
  anamnese: string;

  @Column({ name: 'diagnostic', type: 'varchar' })
  diagnostic: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'appointment_id', type: 'integer' })
  appointmentId: number;
}
