import { DOES_ENUM_STATUS_RESERVATION_EXIST } from '@utils/constants.migrationdb';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1714995568218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "reservation" table already exists in the database.
    const table = await queryRunner.getTable('transactions');

    // Check if the "status_reservation_enum" enum type already exists in the database.
    await queryRunner.query(DOES_ENUM_STATUS_RESERVATION_EXIST);
    // If the table doesn't exist, create it with the specified columns.
    if (!table) {
      await queryRunner.query(`
                CREATE TABLE "transactions" (
                    "transactionId" SERIAL PRIMARY KEY,
                    "userId" INT NOT NULL,
                    "statusPayment" "status_reservation_enum" ,
                    "paymentId" INT NOT NULL,
                    "totalAmount" DECIMAL NOT NULL,
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
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
