import { QueryRunner } from 'typeorm';
import { CreateTableReservations1712751776642 } from './1712751776642-CreateTableReservations';

describe('CreateTableReservations1712751776642', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableReservations1712751776642;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableReservations1712751776642();
  });

  describe('up', () => {
    it('should create the "reservations" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservations');
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservations"')
      );
    });

    it('should not create the "reservations" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservations');
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservations"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "reservations" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "reservations"');
    });
  });
});
