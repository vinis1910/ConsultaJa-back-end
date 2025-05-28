// export class CreateConfigDaysDTO {
//   configDays: Array<DoctorConfigDayDTO>
// }

export class CreateConfigDaysDTO {
  day: string
  startTime: Date
  endTime: Date
  interval: number
  doctorId: number
}
