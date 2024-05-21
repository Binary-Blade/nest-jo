import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsProcessorService } from './reservations-processor.service';
import { QueryHelperService } from '@database/query/query-helper.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { SortOrder } from '@common/enums/sort-order.enum';
import { DEFAULT_PAGE_SIZE } from '@utils/constants/constants.common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<Reservation>;
  let reservationProcessorService: ReservationsProcessorService;
  let queryHelperService: QueryHelperService;

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
        },
        {
          provide: QueryHelperService,
          useValue: {
            buildQueryOptions: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    reservationProcessorService = module.get<ReservationsProcessorService>(
      ReservationsProcessorService
    );
    queryHelperService = module.get<QueryHelperService>(QueryHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateReservation', () => {
    it('should generate reservations for a user', async () => {
      const userId = 1;
      const cartId = 1;
      const reservations: Reservation[] = [{ reservationId: 1 }] as Reservation[];

      jest
        .spyOn(reservationProcessorService, 'processUserReservation')
        .mockResolvedValue(reservations);

      const result = await service.generateReservation(userId, cartId);
      expect(result).toEqual(reservations);
      expect(reservationProcessorService.processUserReservation).toHaveBeenCalledWith(
        userId,
        cartId
      );
    });
  });

  describe('findAll', () => {
    it('should return all reservations for a user', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'date',
        sortOrder: SortOrder.ASC,
        filterBy: 'status',
        filterValue: 'active'
      };
      const reservations: Reservation[] = [{ reservationId: 1 }] as Reservation[];
      const total = 1;

      jest.spyOn(queryHelperService, 'buildQueryOptions').mockReturnValue({});
      jest.spyOn(reservationRepository, 'findAndCount').mockResolvedValue([reservations, total]);

      const result = await service.findAll(userId, paginationFilterDto);
      expect(result).toEqual({ reservations, total });
      expect(queryHelperService.buildQueryOptions).toHaveBeenCalledWith(paginationFilterDto);
      expect(reservationRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
        select: expect.any(Object)
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const userId = 1;
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'date',
        sortOrder: SortOrder.ASC,
        filterBy: 'status',
        filterValue: 'active'
      };

      jest.spyOn(queryHelperService, 'buildQueryOptions').mockReturnValue({});
      jest.spyOn(reservationRepository, 'findAndCount').mockRejectedValue(new Error('Error'));

      await expect(service.findAll(userId, paginationFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAllAdmin', () => {
    it('should return all reservations for an admin', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'date',
        sortOrder: SortOrder.ASC,
        filterBy: 'status',
        filterValue: 'active'
      };
      const reservations: Reservation[] = [{ reservationId: 1 }] as Reservation[];

      jest.spyOn(reservationRepository, 'find').mockResolvedValue(reservations);

      const result = await service.findAllAdmin(paginationFilterDto);
      expect(result).toEqual(reservations);
      expect(reservationRepository.find).toHaveBeenCalledWith({
        skip: paginationFilterDto.offset,
        take: paginationFilterDto.limit ?? DEFAULT_PAGE_SIZE.USER,
        relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
        select: expect.any(Object)
      });
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'date',
        sortOrder: SortOrder.ASC,
        filterBy: 'status',
        filterValue: 'active'
      };

      jest.spyOn(reservationRepository, 'find').mockResolvedValue([]);

      await expect(service.findAllAdmin(paginationFilterDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by ID', async () => {
      const reservationId = 1;
      const userId = 1;
      const reservation = { reservationId, user: { userId } } as Reservation;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      const result = await service.findOne(reservationId, userId);
      expect(result).toEqual(reservation);
      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: { reservationId },
        relations: ['ticket', 'user'],
        select: expect.any(Object)
      });
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const reservationId = 1;
      const userId = 1;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(reservationId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if reservation userId does not match', async () => {
      const reservationId = 1;
      const userId = 1;
      const reservation = { reservationId, user: { userId: 2 } } as Reservation;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      await expect(service.findOne(reservationId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveReservation', () => {
    it('should save a reservation', async () => {
      const reservation: Reservation = { reservationId: 1 } as Reservation;

      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);

      const result = await service.saveReservation(reservation);
      expect(result).toEqual(reservation);
      expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
    });
  });
});
