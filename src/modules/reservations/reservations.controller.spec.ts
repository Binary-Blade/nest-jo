import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { PaginationAndFilterDto } from '@common/dto/pagination-filter.dto';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            generateReservation: jest.fn(),
            findAll: jest.fn(),
            findAllAdmin: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  describe('createReservations', () => {
    const userId = 1;
    const cartId = 1;
    const reservations = [new Reservation()];

    it('should create a reservation successfully', async () => {
      jest.spyOn(service, 'generateReservation').mockResolvedValue(reservations);
      const result = await controller.createReservations(userId, cartId);
      expect(result).toBe(reservations);
      expect(service.generateReservation).toHaveBeenCalledWith(userId, cartId);
    });

    it('should throw a ForbiddenException if unauthorized', async () => {
      jest.spyOn(service, 'generateReservation').mockRejectedValue(new ForbiddenException());
      await expect(controller.createReservations(userId, cartId)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should throw a NotFoundException if the cart does not exist', async () => {
      jest.spyOn(service, 'generateReservation').mockRejectedValue(new NotFoundException());
      await expect(controller.createReservations(userId, cartId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findAll', () => {
    it('should return all reservations for a user with pagination', async () => {
      const userId = 1;
      const paginationDto = new PaginationAndFilterDto();
      const reservations = [new Reservation()];

      jest.spyOn(service, 'findAll').mockResolvedValue({ reservations, total: 1 });
      const result = await controller.findAll(userId, paginationDto);
      expect(result).toEqual({ reservations, total: 1 });
      expect(service.findAll).toHaveBeenCalledWith(userId, paginationDto);
    });
  });

  describe('findAllAdmin', () => {
    it('should return all reservations for an admin', async () => {
      const paginationDto = new PaginationAndFilterDto();
      const reservations = [new Reservation()];

      jest.spyOn(service, 'findAllAdmin').mockResolvedValue(reservations);
      const result = await controller.findAllAdmin(paginationDto);
      expect(result).toBe(reservations);
      expect(service.findAllAdmin).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should find a reservation by ID and user ID', async () => {
      const reservationId = 1;
      const userId = 1;
      const reservation = new Reservation();

      jest.spyOn(service, 'findOne').mockResolvedValue(reservation);
      const result = await controller.findOne(reservationId.toString(), userId);
      expect(result).toBe(reservation);
      expect(service.findOne).toHaveBeenCalledWith(reservationId, userId);
    });
  });
});
