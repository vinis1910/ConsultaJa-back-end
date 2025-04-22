import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ENVIRONMENT from './EnvironmentConfiguration';

export const Database: DynamicModule = TypeOrmModule.forRootAsync({
  useFactory: async () => ({
    type: 'postgres',
    host: ENVIRONMENT.DB_HOST,
    port: Number(ENVIRONMENT.DB_PORT),
    username: ENVIRONMENT.DB_USER,
    password: ENVIRONMENT.DB_PASSWORD,
    database: ENVIRONMENT.DB_NAME,
    logging: ENVIRONMENT.DB_DEBUG,
    entities: ['dist/entities/*{.ts,.js}', 'dist/entities/audit/*{.ts,.js}'],
    subscribers: ['dist/subscribers/*{.ts,.js}'],
    autoLoadEntities: true,
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: false,
  }),
});
