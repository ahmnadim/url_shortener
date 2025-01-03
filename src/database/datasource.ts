import { ConfigService } from '@nestjs/config';
import { Url } from 'src/entities/url.entity';
import { DataSourceOptions } from 'typeorm';

export const createDatasource = (config: ConfigService): DataSourceOptions => {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: parseInt(config.get<string>('DB_PORT'), 10),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    entities: [Url],
    synchronize: true,
  };
};

export default createDatasource;
