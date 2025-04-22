import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'aws_key', type: 'varchar' })
  awsKey: string;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;
}
