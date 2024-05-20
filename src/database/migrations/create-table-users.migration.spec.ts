import { QueryRunner } from 'typeorm';
import { DOES_ENUM_USER_ROLE_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableUsers1711085051379 } from './1711085051379-CreateTableUsers';

describe('CreateTableUsers1711085051379', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableUsers1711085051379;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableUsers1711085051379();
  });

  describe('up', () => {
    it('should create the "users" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('users');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_USER_ROLE_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "users"')
      );
    });

    it('should not create the "users" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('users');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_USER_ROLE_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "users"')
      );
    });
  });
  describe('down', () => {
    it('should drop the "users" table', async () => {
      await migration.down(queryRunner);

      expect(queryRunner.query).toHaveBeenCalledWith('DROP TABLE "users"');
    });
  });
});
