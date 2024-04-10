import { Test, TestingModule } from '@nestjs/testing';
import { ReservationItemsController } from './reservation-items.controller';
import { ReservationItemsService } from './reservation-items.service';

describe('ReservationItemsController', () => {
  let controller: ReservationItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationItemsController],
      providers: [ReservationItemsService],
    }).compile();

    controller = module.get<ReservationItemsController>(ReservationItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
