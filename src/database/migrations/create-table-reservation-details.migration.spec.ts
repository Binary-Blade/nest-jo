import { QueryRunner } from 'typeorm';
import { DOES_ENUM_PRICE_FORMULE_TYPE_EXIST } from '@utils/constants/constants.migrationdb';
import { CreateTableReservationDetails1712751776641 } from './1712751776641-CreateTableReservationDetails';

describe('CreateTableReservationDetails1712751776641', () => {
  let queryRunner: QueryRunner;
  let migration: CreateTableReservationDetails1712751776641;

  beforeEach(() => {
    queryRunner = {
      getTable: jest.fn(),
      query: jest.fn()
    } as unknown as QueryRunner;
    migration = new CreateTableReservationDetails1712751776641();
  });

  describe('up', () => {
    it('should create the "reservation_details" table if it does not exist', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(null);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservation_details');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservation_details"')
      );
    });

    it('should not create the "reservation_details" table if it already exists', async () => {
      (queryRunner.getTable as jest.Mock).mockResolvedValue(true);
      await migration.up(queryRunner);

      expect(queryRunner.getTable).toHaveBeenCalledWith('reservation_details');
      expect(queryRunner.query).toHaveBeenCalledWith(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
      expect(queryRunner.query).not.toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE "reservation_details"')
      );
    });
  });
});
