import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCartItems1712661230450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "cart_items" table already exists in the database.
    const table = await queryRunner.getTable('cart_items');

    // Check if the "type_offer_enum" enum type already exists in the database.
    //await queryRunner.query(DOES_ENUM_OFFER_TYPE_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "cart_items" (
                    "cartItemId" SERIAL PRIMARY KEY,
                    "cartId" INTEGER NOT NULL,
                    "offerId" INTEGER NOT NULL,
                    "quantity" INTEGER NOT NULL,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
