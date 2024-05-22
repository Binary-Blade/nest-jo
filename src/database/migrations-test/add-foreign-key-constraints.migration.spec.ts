import { AddForeignKeyConstraints1712751780000 } from '@database/migrations/1712751780000-AddForeignKey';
import { MigrationInterface, QueryRunner } from 'typeorm';

describe('AddForeignKeyConstraints1712751780000', () => {
  let queryRunner: QueryRunner;
  let migration: MigrationInterface;

  beforeEach(() => {
    queryRunner = {
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new AddForeignKeyConstraints1712751780000();
  });

  describe('up', () => {
    it('should add foreign key constraints to the reservations and tickets tables', async () => {
      await migration.up(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "fk_reservations_users" FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE SET NULL,
            ADD CONSTRAINT "fk_reservations_transactions" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("transactionId") ON DELETE SET NULL, 
            ADD CONSTRAINT "fk_reservations_tickets" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("ticketId") ON DELETE SET NULL;
        `);

      expect(queryRunner.query).toHaveBeenCalledWith(`
            ALTER TABLE "tickets"
            ADD CONSTRAINT "fk_tickets_reservations" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("reservationId") ON DELETE SET NULL;
        `);
    });
  });

  describe('down', () => {
    it('should drop foreign key constraints in reverse order', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith(`
            ALTER TABLE "tickets"
            DROP CONSTRAINT "fk_tickets_reservations";
        `);

      expect(queryRunner.query).toHaveBeenCalledWith(`
            ALTER TABLE "reservations"
            DROP CONSTRAINT "fk_reservations_users",
            DROP CONSTRAINT "fk_reservations_transactions",
            DROP CONSTRAINT "fk_reservations_tickets";
        `);
    });
  });
});
