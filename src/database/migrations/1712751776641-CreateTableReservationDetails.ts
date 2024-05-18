import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableReservationDetails1712751776641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('reservation_details');

    // Check if the "status_reservation_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
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
                    FOREIGN KEY ("eventId") REFERENCES "events" ("eventId") ON DELETE CASCADE
                );
            `);
    }
  }

  /**
   * Reverse the migrations.
   *
   * Drops the "reservation" table, effectively rolling back the migration.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reservations_details"`);
  }
}
