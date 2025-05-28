export class CreateConfigDaysDTO {
  configDays: Array<DoctorConfigDayDTO>
  doctorId: number
}

export class DoctorConfigDayDTO {
  day: string
  startTime: Date
  endTime: Date
  interval: number
}
