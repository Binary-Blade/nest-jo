import { DOES_ENUM_CATEGORY_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "events" table.
 *
 * This migration adds a table for storing event information, including title, descriptions,
 * category, pricing, and dates. This is intended to set up the schema for managing events
 * within the application.
 */
export class CreateTableEvents1712572717258 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "events" table with various columns to store event details.
   * If the table or the "category_type_enum" type already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "events" table to check if it already exists.
    const table = await queryRunner.getTable('events');

    // Ensure the "category_type_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_CATEGORY_TYPE_EXIST);

    // Create the "events" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "events" (
          "eventId" SERIAL PRIMARY KEY,
          "title" VARCHAR NOT NULL UNIQUE,
          "shortDescription" TEXT NOT NULL,
          "longDescription" TEXT NOT NULL,
          "categoryType" "category_type_enum" NOT NULL,
          "basePrice" INTEGER NOT NULL DEFAULT 0,
          "quantityAvailable" INTEGER DEFAULT 0,
          "quantitySold" INTEGER DEFAULT 0,
          "revenueGenerated" INTEGER DEFAULT 0,
          "startDate" TIMESTAMP NOT NULL,
          "endDate" TIMESTAMP NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "events" table, effectively undoing the changes made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "events" table if it exists.
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
