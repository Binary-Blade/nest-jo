import { DOES_ENUM_STATUS_RESERVATION_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Create "transactions" table.
 *
 * This migration adds a table for storing transaction information, including
 * references to the user, payment status, and payment details. This is intended
 * to set up the schema for managing transactions within the application.
 */
export class CreateTableTransactions1712661230452 implements MigrationInterface {
  /**
   * Applies the migration.
   *
   * This method creates the "transactions" table with various columns to store
   * transaction details. If the table or the "status_reservation_enum" type
   * already exists, it skips the creation.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve the "transactions" table to check if it already exists.
    const table = await queryRunner.getTable('transactions');

    // Ensure the "status_reservation_enum" enum type exists in the database.
    await queryRunner.query(DOES_ENUM_STATUS_RESERVATION_EXIST);

    // Create the "transactions" table only if it does not exist.
    if (!table) {
      await queryRunner.query(`
        CREATE TABLE "transactions" (
          "transactionId" SERIAL PRIMARY KEY,
          "userId" INT NULL,
          "statusPayment" "status_reservation_enum",
          "paymentId" INT NOT NULL,
          "totalAmount" DECIMAL NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE SET NULL
        );
      `);
    }
  }

  /**
   * Reverts the migration.
   *
   * This method drops the "transactions" table, effectively undoing the changes
   * made in the "up" method.
   *
   * @param queryRunner The QueryRunner instance used to run database queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the "transactions" table if it exists.
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
