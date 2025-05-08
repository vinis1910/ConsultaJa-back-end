export class ReturnCreatedAppointmentDTO {
  constructor(date: string, price: number, doctorName: string, patientName: string) {
    this.date = date
    this.price = price
    this.doctorName = doctorName
    this.patientName = patientName
  }

  date: string
  price: number
  doctorName: string
  patientName: string
}
