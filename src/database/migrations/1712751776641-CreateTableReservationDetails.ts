import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "reservation_details" table.
 *
 * This migration adds a table for storing detailed information about reservations,
 * including references to the event and pricing information. This is intended
 * to set up the schema for managing reservation details within the application.
 */
export class CreateTableReservationDetails1712751776641 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "reservation_details" table with various columns to store
   * reservation detail information. If the table or the "type_price_formule_enum" type
   * already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "reservation_details" table to check if it already exists.
    const table = await queryRunner.getTable('reservation_details');

    // Ensure the "type_price_formule_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);

    // Create the "reservation_details" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "reservation_details" (
          "reservationDetailsId" SERIAL PRIMARY KEY,
          "eventId" INT NOT NULL,
          "reservationId" INT NOT NULL,
          "priceFormula" "type_price_formule_enum" NOT NULL,
          "price" INT NOT NULL DEFAULT 0,
          "title" VARCHAR NOT NULL,
          "shortDescription" TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("eventId") REFERENCES "events" ("eventId") ON DELETE CASCADE,
          FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId") ON DELETE CASCADE
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "reservation_details" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "reservation_details" table if it exists.
    await queryRunner.query(`DROP TABLE "reservation_details"`);
  }
}
