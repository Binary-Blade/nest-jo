import { CreateTableTickets1712717719010 } from '@database/migrations/1712717719010-CreateTableTickets';
import { QueryRunner } from 'typeorm';

describe('CreateTableTickets1712717719010', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableTickets1712717719010;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableTickets1712717719010();
  });

  describe('up', () => {
    it('should create the "tickets" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('tickets');
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "tickets"')
      );
    });

    it('should not create the "tickets" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('tickets');
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "tickets"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "tickets" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "tickets"');
    });
  });
});
