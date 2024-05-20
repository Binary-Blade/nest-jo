import { QueryRunner } from 'typeorm';
import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableEventPrices1712642603715 } from '@database/migrations/1712642603000-CreateTableEventPrices';

describe('CreateTableEventPrices1712642603715', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableEventPrices1712642603715;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableEventPrices1712642603715();
  });

  describe('up', () => {
    it('should create the "event_prices" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('event_prices');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "event_prices"')
      );
    });

    it('should not create the "event_prices" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('event_prices');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "event_prices"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "event_prices" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "event_prices"');
    });
  });
});
