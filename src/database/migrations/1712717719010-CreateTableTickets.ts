import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "tickets" table.
 *
 * This migration adds a table for storing ticket information, including references
 * to the reservation and security details for ticket validation. This is intended
 * to set up the schema for managing tickets within the application.
 */
export class CreateTableTickets1712717719010 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "tickets" table with various columns to store
   * ticket details. If the table already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "tickets" table to check if it already exists.
    const table = await queryRunner.getTable('tickets');

    // Create the "tickets" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "tickets" (
          "ticketId" SERIAL PRIMARY KEY,
          "reservationId" INT NOT NULL,
          "purchaseKey" VARCHAR(255) NOT NULL,
          "secureKey" VARCHAR(255) NOT NULL,
          "qrCode" TEXT NOT NULL,
          FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId") ON DELETE CASCADE
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "tickets" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "tickets" table if it exists.
    await queryRunner.query(`DROP TABLE "tickets"`);
  }
}
