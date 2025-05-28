// export class CreateConfigDaysDTO {
//   configDays: Array<DoctorConfigDayDTO>
// }

export class CreateConfigDaysDTO {
  day: string
  startTime: string
  endTime: string
  interval: number
  doctorId: number
}
