import { MigrationInterface, QueryRunner } from 'typeorm';
import { DOES_ENUM_STATUS_RESERVATION_EXIST } from './constants-db';

export class CreateTableReservations1712751776642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('reservations');

    // Check if the "status_reservation_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_STATUS_RESERVATION_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "reservations" (
                    "reservationId" SERIAL PRIMARY KEY,
                    "userId" INT NOT NULL,
                    "cartItemId" INT NOT NULL UNIQUE,
                    "ticketId" INT NULL,
                    "paymentId" INT NOT NULL,
                    "status" "status_reservation_enum" DEFAULT 'PENDING',
                    "totalPrice" DECIMAL NOT NULL,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
