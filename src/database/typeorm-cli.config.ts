import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables from .env file into process.env
config();
const configService = new ConfigService();

/**
 * Configures and creates a new TypeORM DataSource.
 * This configuration is intended to set up database connectivity parameters
 * using environment variables loaded by the ConfigService and dotenv.
 *
 * The DataSource includes configurations for database connection, entities, and migrations.
 * Entities and migrations paths are set to load automatically from specified directories.
 */
export default new DataSource({
  type: 'postgres', // Database type
  host: configService.get<string>('PGHOST'),
  port: configService.get<number>('PGPORT'),
  username: configService.get<string>('PGUSER'),
  password: configService.get<string>('PGPASSOWRD'),
  database: configService.get<string>('PGDATABASE'),
  synchronize: false, // Disable auto schema synchronization
  entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'], // Entities path
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'] // Migrations path
});
