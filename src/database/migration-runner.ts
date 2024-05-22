import { Logger } from '@nestjs/common';
import datasource from './typeorm-cli.config';

/**
 * Runs database migrations using TypeORM.
 *
 * @async
 * @function runMigrations
 *
 * @example
 * runMigrations();
 */
export async function runMigrations() {
  const logger = new Logger('migrationRunner');

  try {
    logger.log('Running migration...');
    logger.log('Initializing datasource...');
    await datasource.initialize();

    logger.log('Running migrations...');
    await datasource.runMigrations();
  } catch (err) {
    logger.error('Cannot start the app. Migration has failed!', err);
    process.exit(1); // Exiting with a non-zero code to indicate failure
  }
}
