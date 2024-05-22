import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const configService = new ConfigService();

/**
 * TypeORM DataSource configuration for PostgreSQL.
 *
 * @class
 */
export default new DataSource({
  /**
   * The type of database to connect to.
   *
   * @type {string}
   * @default 'postgres'
   */
  type: 'postgres',

  /**
   * The host of the database.
   *
   * @type {string}
   * @example 'localhost'
   */
  host: configService.get<string>('PGHOST'),

  /**
   * The port of the database.
   *
   * @type {number}
   * @example 5432
   */
  port: configService.get<number>('PGPORT'),

  /**
   * The username to connect to the database.
   *
   * @type {string}
   * @example 'postgres'
   */
  username: configService.get<string>('PGUSER'),

  /**
   * The password to connect to the database.
   *
   * @type {string}
   * @example 'password123'
   */
  password: configService.get<string>('PGPASSOWRD'),

  /**
   * The name of the database.
   *
   * @type {string}
   * @example 'mydatabase'
   */
  database: configService.get<string>('PGDATABASE'),

  /**
   * Whether to synchronize the database schema with entities automatically.
   * This should be disabled in production.
   *
   * @type {boolean}
   * @default false
   */
  synchronize: false,

  /**
   * Paths to the entities files.
   *
   * @type {string[]}
   * @example [__dirname + '/path-to-entity{.ts,.js}']
   */
  entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],

  /**
   * Paths to the migrations files.
   *
   * @type {string[]}
   * @example [__dirname + '/../database/migrations/*{.ts,.js}']
   */
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}']
});
