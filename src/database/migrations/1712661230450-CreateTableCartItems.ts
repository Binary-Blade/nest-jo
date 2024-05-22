import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "cart_items" table.
 *
 * This migration adds a table for storing items in a user's cart, including references to the cart,
 * event, and pricing information. This is intended to set up the schema for managing cart items
 * within the application.
 */
export class CreateTableCartItems1712661230450 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "cart_items" table with various columns to store
   * cart item details. If the table or the "type_price_formule_enum" type
   * already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "cart_items" table to check if it already exists.
    const table = await queryRunner.getTable('cart_items');

    // Ensure the "type_price_formule_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);

    // Create the "cart_items" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "cart_items" (
          "cartItemId" SERIAL PRIMARY KEY,
          "cartId" INTEGER NULL,
          "eventId" INTEGER NULL,
          "priceFormula" "type_price_formule_enum" NOT NULL,
          "price" INTEGER NOT NULL,
          "quantity" INTEGER NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("cartId") REFERENCES "cart" ("cartId") ON DELETE CASCADE,
          FOREIGN KEY ("eventId") REFERENCES "events" ("eventId")
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "cart_items" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "cart_items" table if it exists.
    await queryRunner.query(`DROP TABLE "cart_items"`);
  }
}
