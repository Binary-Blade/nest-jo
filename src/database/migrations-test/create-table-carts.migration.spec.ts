import { CreateTableCarts1712661221574 } from '@database/migrations/1712661221574-CreateTableCarts';
import { QueryRunner } from 'typeorm';

describe('CreateTableCarts1712661221574', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableCarts1712661221574;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableCarts1712661221574();
  });

  describe('up', () => {
    it('should create the "cart" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('cart');
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "cart"')
      );
    });

    it('should not create the "cart" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('cart');
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "cart"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "cart" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "cart"');
    });
  });
});
