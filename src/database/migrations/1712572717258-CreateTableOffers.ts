import { MigrationInterface, QueryRunner } from 'typeorm';
import { DOES_ENUM_OFFER_TYPE_EXIST } from './constants-db';

/**
 * This migration creates the "offers" table in the database.
 */
export class CreateTableOffers1712572717258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "offers" table already exists in the database.
    const table = await queryRunner.getTable('offers');

    // Check if the "type_offer_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_OFFER_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "offers" (
                    "offerId" SERIAL PRIMARY KEY,
                    "title" VARCHAR NOT NULL UNIQUE,
                    "description" TEXT NOT NULL,
                    "type_offer" "type_offer_enum" DEFAULT 'SOLO',
                    "price" DECIMAL NOT NULL,
                    "quantityAvailable" INTEGER DEFAULT 0,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
    }
  }

  /**
   * Reverse the migrations.
   *
   * Drops the "offers" table, effectively rolling back the migration.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "offers"`);
  }
}
