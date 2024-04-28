import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Database module for setting up TypeORM
 *
 * @class DatabaseModule class (module) for setting up TypeORM
 * @method forRootAsync Configure TypeORM based on environment
 * @returns TypeORM configuration
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PGHOST'),
        port: config.get<number>('PGPORT'),
        username: config.get<string>('PGUSER'),
        password: config.get<string>('PGPASSOWRD'),
        database: config.get<string>('PGDATABASE'),
        synchronize: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}']
      })
    })
  ]
})
export class DatabaseModule {}
