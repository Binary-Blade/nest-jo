import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationsProcessorService } from './reservations-processor.service';
import { NotFoundException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<Reservation>;
  let reservationsProcessorService: ReservationsProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useClass: Repository
        },
        {
          provide: ReservationsProcessorService,
          useValue: {
            processUserReservation: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    reservationsProcessorService = module.get<ReservationsProcessorService>(
      ReservationsProcessorService
    );
  });

  describe('generateReservation', () => {
    it('should generate a reservation successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const reservations = [{} as Reservation];

      jest
        .spyOn(reservationsProcessorService, 'processUserReservation')
        .mockResolvedValue(reservations);

      const result = await service.generateReservation(userId, cartId);
      expect(result).toBe(reservations);
      expect(reservationsProcessorService.processUserReservation).toHaveBeenCalledWith(
        userId,
        cartId
      );
    });
  });

  describe('findAll', () => {
    it('should find all reservations for a user', async () => {
      const userId = 1;
      const reservations = [{} as Reservation];

      jest.spyOn(reservationRepository, 'find').mockResolvedValue(reservations);

      const result = await service.findAll(userId);
      expect(result).toBe(reservations);
      expect(reservationRepository.find).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: ['user', 'reservationDetails']
      });
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      jest.spyOn(reservationRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll(1);
      expect(result).toEqual([]);
    });
  });

  describe('findAllAdmin', () => {
    it('should find all reservations for an admin', async () => {
      const reservations = [{} as Reservation];

      jest.spyOn(reservationRepository, 'find').mockResolvedValue(reservations);

      const result = await service.findAllAdmin();
      expect(result).toBe(reservations);
      expect(reservationRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should find a single reservation by ID and user ID', async () => {
      const reservation = { reservationId: 1, user: { userId: 1 } } as Reservation;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      const result = await service.findOne(1, 1);
      expect(result).toBe(reservation);
      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: { reservationId: 1 },
        relations: ['ticket', 'user', 'cartItem.event', 'reservationDetails'],
        select: {
          reservationId: true,
          ticket: {
            ticketId: true,
            qrCode: true
          }
        }
      });
    });

    it('should throw NotFoundException if the reservation does not belong to the user', async () => {
      const reservation = { reservationId: 1, user: { userId: 2 } } as Reservation;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the reservation does not exist', async () => {
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveReservation', () => {
    it('should save a reservation successfully', async () => {
      const reservation = {} as Reservation;

      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);

      const result = await service.saveReservation(reservation);
      expect(result).toBe(reservation);
      expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
    });
  });
});
