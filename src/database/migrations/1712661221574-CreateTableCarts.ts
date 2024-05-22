import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "cart" table.
 *
 * This migration adds a table for storing shopping cart information, including
 * references to the user and timestamps for creation and updates.
 */
export class CreateTableCarts1712661221574 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "cart" table with various columns to store cart details.
   * If the table already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "cart" table to check if it already exists.
    const table = await queryRunner.getTable('cart');

    // Create the "cart" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "cart" (
          "cartId" SERIAL PRIMARY KEY,
          "userId" INTEGER NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE CASCADE
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "cart" table, effectively undoing the changes made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "cart" table if it exists.
    await queryRunner.query(`DROP TABLE "cart"`);
  }
}
