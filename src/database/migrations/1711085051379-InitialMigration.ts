import { MigrationInterface, QueryRunner } from 'typeorm';
import { DOES_ENUM_USER_ROLE_EXIST } from './constants-db';

/**
 * Initial migration to create the "users" table in the database.
 *
 * This migration adds a table for storing user information, including their
 * email, password, and role. It's intended to be the initial schema setup for
 * managing user data within the application.
 */
export class InitialMigration1711085051379 implements MigrationInterface {
  /**
   * Run the migrations.
   *
   * Creates the "users" table with columns for user ID, email, password, role and token version.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "users" table already exists in the database.
    const table = await queryRunner.getTable('users');

    // Check if the "user_role_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_USER_ROLE_EXIST);

    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "users" (
                    "userId" SERIAL PRIMARY KEY,
                    "email" VARCHAR NOT NULL UNIQUE,
                    "firstName" VARCHAR NOT NULL,
                    "lastName" VARCHAR NOT NULL,
                    "passwordHash" VARCHAR NOT NULL,
                    "accountKey" VARCHAR UNIQUE,
                    "role" "user_role_enum" DEFAULT 'USER',
                    "tokenVersion" INTEGER DEFAULT 1,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "lastLogin" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
    }
  }

  /**
   * Reverse the migrations.
   *
   * Drops the "users" table, effectively rolling back the migration.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
