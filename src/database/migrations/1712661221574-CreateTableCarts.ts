import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCarts1712661221574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "carts" table already exists in the database.
    const table = await queryRunner.getTable('cart');

    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "cart" (
                    "cartId" SERIAL PRIMARY KEY,
                    "userId" INTEGER NOT NULL,
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
    await queryRunner.query(`DROP TABLE "cart"`);
  }
}
