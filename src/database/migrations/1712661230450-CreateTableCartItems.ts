import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCartItems1712661230450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "cart_items" table already exists in the database.
    const table = await queryRunner.getTable('cart_items');

    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "cart_items" (
                    "cartItemId" SERIAL PRIMARY KEY,
                    "cartId" INTEGER NULL,
                    "eventId" INTEGER NOT NULL,
                    "priceFormula" "type_price_formule_enum" NOT NULL,
                    "price" INTEGER NOT NULL,
                    "quantity" INTEGER NOT NULL,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY ("cartId") REFERENCES "cart" ("cartId"),
                    FOREIGN KEY ("eventId") REFERENCES "events" ("eventId") 
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
    await queryRunner.query(`DROP TABLE "cart_items"`);
  }
}
