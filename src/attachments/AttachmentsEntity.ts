import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attachments_chat')
export class AttachmentsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'aws_key', type: 'varchar' })
  awsKey: string;

  @Column({ name: 'message_id', type: 'integer' })
  messageId: number;

  @Column({ name: 'type', type: 'integer' })
  type: string;
}
