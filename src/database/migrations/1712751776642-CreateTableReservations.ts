import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableReservations1712751776642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('reservations');

    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "reservations" (
                    "reservationId" SERIAL PRIMARY KEY,
                    "userId" INT NULL,
                    "cartItemId" INT NULL,
                    "transactionId" INT NULL,
                    "reservationDetailsId" INT NULL, 
                    "ticketId" INT NULL,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE SET NULL,
                    FOREIGN KEY ("transactionId") REFERENCES "transactions" ("transactionId") ON DELETE SET NULL,
                    FOREIGN KEY ("cartItemId") REFERENCES "cart_items" ("cartItemId") ON DELETE SET NULL
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
    await queryRunner.query(`DROP TABLE "reservations"`);
  }
}
