import { CreateTableReservations1712661230451 } from '@database/migrations/1712661230451-CreateTableReservations';
import { MigrationInterface, QueryRunner } from 'typeorm';

describe('CreateTableReservations1712661230451', () => {
  let queryRunner: QueryRunner;
  let migration: MigrationInterface;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableReservations1712661230451();
  });

  describe('up', () => {
    it('should create the reservations table if it does not exist', async () => {
      jest.spyOn(queryRunner, 'getTable').mockResolvedValue(undefined);

      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservations');
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservations"')
      );
    });

    it('should not create the reservations table if it already exists', async () => {
      jest.spyOn(queryRunner, 'getTable').mockResolvedValue({} as any);

      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservations');
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservations"')
      );
    });
  });

  describe('down', () => {
    it('should drop the reservations table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "reservations"');
    });
  });
});
