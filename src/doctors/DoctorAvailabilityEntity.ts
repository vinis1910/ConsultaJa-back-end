import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Weekday } from '../enums/WeekDayEnum';

@Entity('doctor_availability')
export class DoctorAvailabilityEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'doctor_id', type: 'integer' })
  doctorId: number;

  @Column({ type: 'enum', enum: Weekday, enumName: 'weekday_enum' })
  weekDay: Weekday;

  @Column({ name: 'start_time', type: 'time' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'time' })
  endTime: Date;
}
