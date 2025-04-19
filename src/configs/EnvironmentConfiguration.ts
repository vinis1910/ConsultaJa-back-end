import * as dotenv from 'dotenv'
dotenv.config()

import { Logger } from '@nestjs/common'
import { envValidationSchema } from './EnvironmentValidationSchema'

const { value: ENVIRONMENT, error } = envValidationSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
})

if (error) {
  Logger.error('Erro ao validar variáveis de ambiente:')
  error.details.forEach((detail) => {
    Logger.error(`- ${detail.message}`)
  })
  process.exit(1)
}

export default ENVIRONMENT as Record<string, string>
