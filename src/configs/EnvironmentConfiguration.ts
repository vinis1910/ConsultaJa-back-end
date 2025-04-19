import { Logger } from '@nestjs/common';
import { envValidationSchema } from './EnvironmentValidationSchema';
import Joi from 'joi';

if (
  !envValidationSchema ||
  !envValidationSchema['_ids'] ||
  !envValidationSchema['_ids']['_byKey']
) {
  Logger.error('envValidationSchema is not defined');
  process.exit(1);
}

const processEnv = [...envValidationSchema['_ids']['_byKey']].reduce(
  (acc, it) => {
    acc[it[0]] = process.env[it[0]];
    return acc;
  },
  {},
);

const ENVIRONMENT = Joi.attempt(processEnv, envValidationSchema);

export default ENVIRONMENT as NonNullable<typeof ENVIRONMENT>;
