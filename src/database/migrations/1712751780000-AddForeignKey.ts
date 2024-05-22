import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to add foreign key constraints to the reservations and tickets tables.
 *
 * @class
 */
export class AddForeignKeyConstraints1712751780000 implements MigrationInterface {
  /**
   * Runs the migration, adding foreign key constraints to the reservations and tickets tables.
   *
   * @param {QueryRunner} queryRunner - The QueryRunner instance used to run the migration queries.
   * @returns {Promise<void>}
   *
   * @example
   * await queryRunner.up(queryRunner);
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign keys to reservations
    await queryRunner.query(`
      ALTER TABLE "reservations"
      ADD CONSTRAINT "fk_reservations_users" FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE SET NULL,
      ADD CONSTRAINT "fk_reservations_transactions" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("transactionId") ON DELETE SET NULL, 
      ADD CONSTRAINT "fk_reservations_tickets" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("ticketId") ON DELETE SET NULL;
    `);

    // Add foreign key to tickets
    await queryRunner.query(`
      ALTER TABLE "tickets"
      ADD CONSTRAINT "fk_tickets_reservations" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId") ON DELETE SET NULL;
    `);
  }

  /**
   * Reverts the migration, dropping the foreign key constraints added in the up method.
   *
   * @param {QueryRunner} queryRunner - The QueryRunner instance used to run the migration queries.
   * @returns {Promise<void>}
   *
   * @example
   * await queryRunner.down(queryRunner);
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys in reverse order of addition
    await queryRunner.query(`
      ALTER TABLE "tickets"
      DROP CONSTRAINT "fk_tickets_reservations";
    `);

    await queryRunner.query(`
      ALTER TABLE "reservations"
      DROP CONSTRAINT "fk_reservations_users",
      DROP CONSTRAINT "fk_reservations_transactions",
      DROP CONSTRAINT "fk_reservations_tickets";
    `);
  }
}
