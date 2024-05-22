import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "event_prices" table.
 *
 * This migration adds a table for storing pricing information for events,
 * including the event ID, price formula, and price. This is intended to set up
 * the schema for managing event pricing within the application.
 */
export class CreateTableEventPrices1712642603715 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "event_prices" table with various columns to store
   * event pricing details. If the table or the "type_price_formule_enum" type
   * already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "event_prices" table to check if it already exists.
    const table = await queryRunner.getTable('event_prices');

    // Ensure the "type_price_formule_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);

    // Create the "event_prices" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "event_prices" (
          "eventPriceId" SERIAL PRIMARY KEY,
          "eventId" INTEGER NOT NULL,
          "priceFormula" "type_price_formule_enum" NOT NULL,
          "price" INTEGER NOT NULL,
          FOREIGN KEY ("eventId") REFERENCES "events" ("eventId") ON DELETE CASCADE
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "event_prices" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "event_prices" table if it exists.
    await queryRunner.query(`DROP TABLE "event_prices"`);
  }
}
