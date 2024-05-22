import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module to set up and configure the database connection using TypeORM.
 * @module
 */
@Module({
  imports: [
    /**
     * Configures TypeORM to connect to a PostgreSQL database using async configuration.
     *
     * @remarks
     * The configuration is dynamically loaded from environment variables using the ConfigService.
     *
     * @example
     * TypeOrmModule.forRootAsync({
     *   imports: [ConfigModule],
     *   inject: [ConfigService],
     *   useFactory: (config: ConfigService) => ({
     *     type: 'postgres',
     *     host: config.get<string>('PGHOST'),
     *     port: config.get<number>('PGPORT'),
     *     username: config.get<string>('PGUSER'),
     *     password: config.get<string>('PGPASSOWRD'),
     *     database: config.get<string>('PGDATABASE'),
     *     synchronize: false,
     *     entities: [__dirname + '/*.entity{.ts,.js}']
     *   })
     * })
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PGHOST'), // Database host
        port: config.get<number>('PGPORT'), // Database port
        username: config.get<string>('PGUSER'), // Database username
        password: config.get<string>('PGPASSOWRD'), // Database password
        database: config.get<string>('PGDATABASE'), // Database name
        synchronize: false, // Whether to synchronize the database schema (use false in production)
        entities: [__dirname + '/../**/*.entity{.ts,.js}'] // Path to the entities
      })
    })
  ]
})
export class DatabaseModule {}
