import { QueryRunner } from 'typeorm';
import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableCartItems1712661230450 } from '@database/migrations/1712661230450-CreateTableCartItems';

describe('CreateTableCartItems1712661230450', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableCartItems1712661230450;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableCartItems1712661230450();
  });

  describe('up', () => {
    it('should create the "cart_items" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('cart_items');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "cart_items"')
      );
    });

    it('should not create the "cart_items" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('cart_items');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "cart_items"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "cart_items" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "cart_items"');
    });
  });
});
