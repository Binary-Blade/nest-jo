import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailsService } from './reservation-details.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { NotFoundException } from '@nestjs/common';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

describe('ReservationDetailsService', () => {
  let service: ReservationDetailsService;
  let reservationDetailsRepository: Repository<ReservationDetails>;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationDetailsService,
        {
          provide: getRepositoryToken(ReservationDetails),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Event),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<ReservationDetailsService>(ReservationDetailsService);
    reservationDetailsRepository = module.get<Repository<ReservationDetails>>(
      getRepositoryToken(ReservationDetails)
    );
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('createReservationDetailsFromReservation', () => {
    it('should throw NotFoundException if event is not found in cartItem', async () => {
      const reservation = new Reservation();
      const cartItem = new CartItem();
      cartItem.event = null; // Simulate missing event

      await expect(
        service.createReservationDetailsFromReservation(reservation, cartItem)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if event is not found in the database', async () => {
      const reservation = new Reservation();
      const cartItem = new CartItem();
      cartItem.event = { eventId: 1 } as Event;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null); // Simulate event not found

      await expect(
        service.createReservationDetailsFromReservation(reservation, cartItem)
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and return reservation details', async () => {
      const reservation = new Reservation();
      reservation.reservationId = 1;
      const cartItem = new CartItem();
      cartItem.event = { eventId: 1, title: 'Event 1', shortDescription: 'Description 1' } as Event;
      cartItem.priceFormula = PriceFormulaEnum.DUO;
      cartItem.price = 100;

      const event = { eventId: 1, title: 'Event 1', shortDescription: 'Description 1' } as Event;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest.spyOn(reservationDetailsRepository, 'create').mockReturnValue({
        reservationDetailsId: 1,
        reservation,
        event,
        priceFormula: PriceFormulaEnum.DUO,
        title: 'Event 1',
        price: 100,
        shortDescription: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      } as ReservationDetails);
      jest.spyOn(reservationDetailsRepository, 'save').mockResolvedValue({
        reservationDetailsId: 1,
        reservation,
        event,
        priceFormula: PriceFormulaEnum.DUO,
        title: 'Event 1',
        price: 100,
        shortDescription: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      } as ReservationDetails);

      const result = await service.createReservationDetailsFromReservation(reservation, cartItem);

      expect(result).toEqual({
        reservationDetailsId: 1,
        reservation,
        event,
        priceFormula: PriceFormulaEnum.DUO,
        title: 'Event 1',
        price: 100,
        shortDescription: 'Description 1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if reservation details is not found', async () => {
      jest.spyOn(reservationDetailsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return reservation details if found', async () => {
      const reservationDetails = {
        reservationDetailsId: 1,
        reservation: { reservationId: 1 } as Reservation,
        event: { eventId: 1 } as Event,
        priceFormula: PriceFormulaEnum.DUO,
        title: 'Event 1',
        price: 100,
        shortDescription: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      } as ReservationDetails;

      jest.spyOn(reservationDetailsRepository, 'findOne').mockResolvedValue(reservationDetails);

      const result = await service.findOne(1);

      expect(result).toEqual(reservationDetails);
    });
  });
});
