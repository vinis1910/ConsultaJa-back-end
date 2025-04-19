import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message_chat')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'appointment_id', type: 'integer' })
  appointmentId: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'message', type: 'varchar' })
  message: string;

  @Column({ name: 'sent_at', type: 'timestamp' })
  sentAt: Date;

  @Column({ name: 'was_read', type: 'bool' })
  wasRead: boolean;
}
