import { DOES_ENUM_CATEGORY_TYPE_EXIST } from '@utils/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration creates the "events" table in the database.
 */
export class CreateTableEvents1712572717258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "events" table already exists in the database.
    const table = await queryRunner.getTable('events');

    await queryRunner.query(DOES_ENUM_CATEGORY_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "events" (
                    "eventId" SERIAL PRIMARY KEY,
                    "title" VARCHAR NOT NULL UNIQUE,
                    "description" TEXT NOT NULL,
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
   * Reverse the migrations.
   *
   * Drops the "events" table, effectively rolling back the migration.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
