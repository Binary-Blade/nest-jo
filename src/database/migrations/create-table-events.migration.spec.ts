import { QueryRunner } from 'typeorm';
import { DOES_ENUM_CATEGORY_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableEvents1712572717258 } from './1712572717258-CreateTableEvents';

describe('CreateTableEvents1712572717258', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableEvents1712572717258;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableEvents1712572717258();
  });

  describe('up', () => {
    it('should create the "events" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('events');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_CATEGORY_TYPE_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "events"')
      );
    });

    it('should not create the "events" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('events');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_CATEGORY_TYPE_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "events"')
      );
    });
  });

  describe('down', () => {
    it('should drop the "events" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "events"');
    });
  });
});
