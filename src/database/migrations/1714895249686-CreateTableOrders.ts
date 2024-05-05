import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DOES_ENUM_PRICE_FORMULE_TYPE_EXIST,
  DOES_ENUM_STATUS_RESERVATION_EXIST
} from './constants-db';

export class CreateTableOrders1714895249686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('orders');

    // Check if the "status_reservation_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
    await queryRunner.query(DOES_ENUM_STATUS_RESERVATION_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "orders" (
                    "orderId" SERIAL PRIMARY KEY,
                    "eventId" INT NOT NULL,
                    "paymentId" INT NOT NULL,
                    "reservationId" INT NOT NULL,
                    "statusPayment" "status_reservation_enum" DEFAULT 'PENDING',
                    "priceFormula" "type_price_formule_enum" NOT NULL,
                    "title" VARCHAR NOT NULL, 
                    "description" TEXT NOT NULL,
                    "quantity" INT NOT NULL,
                    "totalPrice" DECIMAL NOT NULL,
                    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                     FOREIGN KEY ("eventId") REFERENCES "events" ("eventId"),
                    FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId")
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
    await queryRunner.query(`DROP TABLE "orders"`);
  }
}
