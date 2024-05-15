import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailsService } from './reservation-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
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
          useValue: { create: jest.fn(), save: jest.fn(), findOne: jest.fn() }
        },
        {
          provide: getRepositoryToken(Event),
          useValue: { findOne: jest.fn() }
        }
      ]
    }).compile();

    service = module.get<ReservationDetailsService>(ReservationDetailsService);
    reservationDetailsRepository = module.get(getRepositoryToken(ReservationDetails));
    eventRepository = module.get(getRepositoryToken(Event));
  });

  describe('createReservationDetailsFromReservation', () => {
    it('should create reservation details successfully', async () => {
      const reservation = { reservationId: 1 } as Reservation;
      const event = { eventId: 1, title: 'Event Title', description: 'Event Description' } as Event;
      const cartItem = {
        event,
        priceFormula: PriceFormulaEnum.SOLO,
        price: 100
      } as CartItem;
      const reservationDetails = {} as ReservationDetails;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest.spyOn(reservationDetailsRepository, 'create').mockReturnValue(reservationDetails);
      jest.spyOn(reservationDetailsRepository, 'save').mockResolvedValue(reservationDetails);

      const result = await service.createReservationDetailsFromReservation(reservation, cartItem);
      expect(result).toEqual(reservationDetails);
      expect(reservationDetailsRepository.create).toHaveBeenCalledWith({
        title: event.title,
        description: event.description,
        priceFormula: 'SOLO',
        price: 100,
        event: { eventId: 1 },
        reservation: { reservationId: 1 }
      });
    });

    it('should throw NotFoundException if the event is not found', async () => {
      const reservation = { reservationId: 1 } as Reservation;
      const cartItem = { event: { eventId: 999 } } as CartItem;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createReservationDetailsFromReservation(reservation, cartItem)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find one reservation detail by ID', async () => {
      const reservationDetails = new ReservationDetails();
      jest.spyOn(reservationDetailsRepository, 'findOne').mockResolvedValue(reservationDetails);

      const result = await service.findOne(1);
      expect(result).toBe(reservationDetails);
      expect(reservationDetailsRepository.findOne).toHaveBeenCalledWith({
        where: { reservationDetailsId: 1 },
        relations: ['event', 'reservation']
      });
    });

    it('should throw NotFoundException if the reservation detail does not exist', async () => {
      jest.spyOn(reservationDetailsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
