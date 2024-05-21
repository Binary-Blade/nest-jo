import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableEventPrices1712642603715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "cart_items" table already exists in the database.
    const table = await queryRunner.getTable('event_prices');

    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "event_prices" (
                    "eventPriceId" SERIAL PRIMARY KEY,
                    "eventId" INTEGER NOT NULL,
                    "priceFormula" "type_price_formule_enum" NOT NULL,
                    "price" INTEGER NOT NULL,
                    FOREIGN KEY ("eventId") REFERENCES "events" ("eventId") DELETE ON CASCADE
                );
            `);
    }
  }

  /**
   * Reverse the migrations.
   *
   * Drops the "carts" table, effectively rolling back the migration.
   *
   * @param queryRunner The QueryRunner instance that allows manipulation of the database.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_prices"`);
  }
}
