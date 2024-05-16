import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PaginationAndFilterDto } from '@common/dto/pagination-filter.dto';
import { ReservationsProcessorService } from './reservations-processor.service';
import { SortOrder } from '@common/enums/sort-order.enum';

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
          useValue: {
            findAndCount: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn()
          }
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
    reservationRepository = module.get(getRepositoryToken(Reservation));
    reservationsProcessorService = module.get(ReservationsProcessorService);
  });

  describe('generateReservation', () => {
    it('should generate a reservation successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const reservations = [new Reservation()];

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
    it('should find all reservations for a user with pagination and sorting', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.ASC,
        filterBy: null,
        filterValue: null
      };
      const reservations = [new Reservation()];
      const total = 1;

      jest.spyOn(reservationRepository, 'findAndCount').mockResolvedValue([reservations, total]);

      const result = await service.findAll(userId, paginationFilterDto);
      expect(result).toEqual({ reservations, total });
      expect(reservationRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
        select: {
          reservationId: true,
          reservationDetails: {
            title: true,
            shortDescription: true,
            price: true,
            priceFormula: true,
            event: {
              eventId: true,
              title: true,
              shortDescription: true,
              longDescription: true,
              categoryType: true,
              startDate: true,
              endDate: true
            }
          },
          transaction: {
            statusPayment: true,
            paymentId: true
          }
        },
        order: { createdAt: 'ASC' },
        skip: 0,
        take: 10
      });
    });

    it('should handle database errors during find all', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: SortOrder.ASC,
        filterBy: null,
        filterValue: null
      };
      jest
        .spyOn(reservationRepository, 'findAndCount')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(userId, paginationFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAllAdmin', () => {
    it('should find all reservations for an admin with specified fields', async () => {
      const reservations = [new Reservation()];
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: null,
        sortOrder: null,
        filterBy: null,
        filterValue: null
      };

      jest.spyOn(reservationRepository, 'find').mockResolvedValue(reservations);

      const result = await service.findAllAdmin(paginationFilterDto);
      expect(result).toBe(reservations);
      expect(reservationRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
        select: {
          reservationId: true,
          user: { userId: true, email: true },
          reservationDetails: { title: true, event: { eventId: true } },
          transaction: {
            transactionId: true,
            statusPayment: true,
            paymentId: true,
            totalAmount: true
          }
        },
        skip: 0,
        take: 10
      });
    });

    it('should throw NotFoundException if no reservations found for admin', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: null,
        sortOrder: null,
        filterBy: null,
        filterValue: null
      };
      jest.spyOn(reservationRepository, 'find').mockResolvedValue([]);

      await expect(service.findAllAdmin(paginationFilterDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find a single reservation by ID and user ID', async () => {
      const reservation = { reservationId: 1, user: { userId: 1 } } as Reservation;

      // Simulate the service's call to findOne that retrieves a reservation with specific relations and fields.
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      const result = await service.findOne(1, 1);
      expect(result).toBe(reservation);
      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: { reservationId: 1 },
        relations: ['ticket', 'user'],
        select: {
          reservationId: true,
          user: {
            userId: true
          },
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
