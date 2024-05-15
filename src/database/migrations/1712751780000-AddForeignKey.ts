import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyConstraints1712751780000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign keys to reservations
    await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "fk_reservations_users" FOREIGN KEY ("userId") REFERENCES "users" ("userId"),
            ADD CONSTRAINT "fk_reservations_transactions" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("transactionId"),
            ADD CONSTRAINT "fk_reservations_tickets" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("ticketId");
        `);

    // Add foreign key to tickets
    await queryRunner.query(`
            ALTER TABLE "tickets"
            ADD CONSTRAINT "fk_tickets_reservations" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys in reverse order of addition
    await queryRunner.query(`
            ALTER TABLE "tickets"
            DROP CONSTRAINT "fk_tickets_reservations";
        `);

    await queryRunner.query(`
            ALTER TABLE "reservations"
            DROP CONSTRAINT "fk_reservations_users",
            DROP CONSTRAINT "fk_reservations_cart_items",
            DROP CONSTRAINT "fk_reservations_transactions",
            DROP CONSTRAINT "fk_reservations_tickets";
        `);
  }
}
