import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import ENVIRONMENT from 'src/configs/EnvironmentConfiguration'

@Injectable()
export class EmailService {
  private readonly apiKey = ENVIRONMENT.MAILERSEND_API_KEY
  private readonly apiUrl = 'https://api.mailersend.com/v1/email'
  private readonly logger = new Logger(EmailService.name)

  async sendEmail(to: string, subject: string, html: string) {
    const payload = {
      from: {
        email: 'noreply@vgbezerra.dev.br',
        name: 'ConsultaJá',
      },
      to: [{ email: to }],
      subject,
      html,
    }

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      this.logger.log(`E-mail enviado para ${to}`)
      return response.data
    } catch (error) {
      this.logger.error(`Erro ao enviar e-mail: ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  generateAppointmentReminderTemplate(patientName: string, doctorName: string, date: string, time: string) {
    const year = new Date().getFullYear()

    const templatePath = path.join(process.cwd(), 'src', 'emails', 'templates', 'AppointmentReminderTemplate.html')
    const template = fs.readFileSync(templatePath, 'utf-8')

    return template
      .replace(/{{patientName}}/g, patientName)
      .replace(/{{doctorName}}/g, doctorName)
      .replace(/{{date}}/g, date)
      .replace(/{{time}}/g, time)
      .replace(/{{year}}/g, year.toString())
  }
}
