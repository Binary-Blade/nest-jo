import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "reservations" table.
 *
 * This migration adds a table for storing reservation information, including references
 * to the user, cart item, transaction, reservation details, and ticket. This is intended
 * to set up the schema for managing reservations within the application.
 */
export class CreateTableReservations1712661230451 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "reservations" table with various columns to store
   * reservation details. If the table already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "reservations" table to check if it already exists.
    const table = await queryRunner.getTable('reservations');

    // Create the "reservations" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "reservations" (
          "reservationId" SERIAL PRIMARY KEY,
          "userId" INT NULL,
          "cartItemId" INT NULL,
          "transactionId" INT NULL,
          "reservationDetailsId" INT NULL, 
          "ticketId" INT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE SET NULL,
          FOREIGN KEY ("cartItemId") REFERENCES "cart_items" ("cartItemId") ON DELETE SET NULL
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "reservations" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "reservations" table if it exists.
    await queryRunner.query(`DROP TABLE "reservations"`);
  }
}
