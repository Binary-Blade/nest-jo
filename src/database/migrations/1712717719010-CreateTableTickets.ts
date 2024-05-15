import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTickets1712717719010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('tickets');

    // Check if the "status_reservation_enum" enum type already exists in the database.
    // await queryRunner.query(DOES_ENUM_STATUS_RESERVATION_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "tickets" (
                    "ticketId" SERIAL PRIMARY KEY,
                    "reservationId" INT NOT NULL,
                    "purchaseKey" VARCHAR(255) NOT NULL,
                    "secureKey" VARCHAR(255) NOT NULL,
                    "qrCode" TEXT NOT NULL
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
    await queryRunner.query(`DROP TABLE "tickets"`);
  }
}
