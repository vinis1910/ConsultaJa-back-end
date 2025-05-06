export class ReturnCreatedAppointmentDTO {
  constructor(date: string, status: string, price: number, patientId: number, doctorId: number) {
    this.date = date
    this.status = status
    this.price = price
    this.patientId = patientId
    this.doctorId = doctorId
  }
  date: string
  status: string
  price: number
  patientId: number
  doctorId: number
}
