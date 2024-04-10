import { Test, TestingModule } from '@nestjs/testing';
import { ReservationItemsService } from './reservation-items.service';

describe('ReservationItemsService', () => {
  let service: ReservationItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationItemsService],
    }).compile();

    service = module.get<ReservationItemsService>(ReservationItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
