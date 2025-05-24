import { format } from 'date-fns'

export class ReturnCreatedAppointmentDTO {
  startTime: string
  endTime: string
  date: string
  doctorName: string
  patientName: string

  constructor(startTime: Date, endTime: Date, date: Date, doctorName: string, patientName: string) {
    this.startTime = format(startTime, 'yyyy-MM-dd HH:mm')
    this.endTime = format(endTime, 'yyyy-MM-dd HH:mm')
    this.date = format(date, 'yyyy-MM-dd')
    this.doctorName = doctorName
    this.patientName = patientName
  }
}
