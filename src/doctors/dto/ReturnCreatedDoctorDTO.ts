export class ReturnCreatedDoctorDTO {
  id: number
  name: string
  birthDate: Date
  crm: string
  crmUf: string
  phone: string
  email: string
  password: string

  constructor(id: number, name: string, birthDate: Date, crm: string, crmUf: string, phone: string, email: string) {
    this.id = id
    this.name = name
    this.birthDate = birthDate
    this.crm = crm
    this.crmUf = crmUf
    this.phone = phone
    this.email = email
  }
}
