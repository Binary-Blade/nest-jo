import { MigrationInterface, QueryRunner } from 'typeorm';
import { DOES_ENUM_STATUS_RESERVATION_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableTransactions1712661230452 } from '@database/migrations/1712661230452-CreateTableTransactions';

describe('CreateTableTransactions1712661230452', () => {
  let queryRunner: QueryRunner;
  let migration: MigrationInterface;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableTransactions1712661230452();
  });

  describe('up', () => {
    it('should create the transactions table if it does not exist', async () => {
      jest.spyOn(queryRunner, 'getTable').mockResolvedValue(undefined);

      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('transactions');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_STATUS_RESERVATION_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "transactions"')
      );
    });

    it('should not create the transactions table if it already exists', async () => {
      jest.spyOn(queryRunner, 'getTable').mockResolvedValue({} as any);

      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('transactions');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_STATUS_RESERVATION_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "transactions"')
      );
    });
  });

  describe('down', () => {
    it('should drop the transactions table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "transactions"');
    });
  });
});
