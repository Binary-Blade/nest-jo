import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const configService = new ConfigService();

/**
 * TypeORM DataSource configuration for PostgreSQL.
 *
 * @remarks
 * The configuration values are loaded from environment variables using the ConfigService.
 * This configuration is used for setting up the connection to the PostgreSQL database.
 *
 * @example
 * export default new DataSource({
 *   type: 'postgres',
 *   host: configService.get<string>('PGHOST'),
 *   port: configService.get<number>('PGPORT'),
 *   username: configService.get<string>('PGUSER'),
 *   password: configService.get<string>('PGPASSOWRD'),
 *   database: configService.get<string>('PGDATABASE'),
 *   synchronize: false,
 *   entities: [__dirname + '/path-to-entity{.ts,.js}'],
 *   migrations: [__dirname + '/path-to-migration/migrations/*{.ts,.js}']
 * });
 */
export default new DataSource({
  type: 'postgres', // Database type
  host: configService.get<string>('PGHOST'), // Database host
  port: configService.get<number>('PGPORT'), // Database port
  username: configService.get<string>('PGUSER'), // Database username
  password: configService.get<string>('PGPASSOWRD'), // Database password
  database: configService.get<string>('PGDATABASE'), // Database name
  synchronize: false, // Disable auto-synchronization in production
  entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'], // Path to the entities
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'] // Path to the migrations
});
