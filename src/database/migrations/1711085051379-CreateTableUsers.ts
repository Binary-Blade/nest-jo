import { DOES_ENUM_USER_ROLE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "users" table.
 *
 * This migration adds a table for storing user information, including their
 * email, password, and role. This is intended to be the initial schema setup
 * for managing user data within the application.
 */
export class CreateTableUsers1711085051379 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "users" table with various columns to store user details.
   * If the table or the "user_role_enum" type already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "users" table to check if it already exists.
    const table = await queryRunner.getTable('users');

    // Ensure the "user_role_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_USER_ROLE_EXIST);

    // Create the "users" table only if it does not exist.
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
          "isActive" BOOLEAN DEFAULT TRUE,
          "tokenVersion" INTEGER DEFAULT 1,
          "transactionsCount" INTEGER DEFAULT 0,
          "totalSpent" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "lastLogin" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "users" table, effectively undoing the changes made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "users" table if it exists.
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
