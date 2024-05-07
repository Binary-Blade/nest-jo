import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
    it('should create a reservation successfully', async () => {
      const userId = 1;
      const cartId = 1;
      const reservations = [{} as Reservation];

      jest.spyOn(service, 'generateReservation').mockResolvedValue(reservations);

      const result = await controller.createReservations(userId, cartId);
      expect(result).toBe(reservations);
      expect(service.generateReservation).toHaveBeenCalledWith(userId, cartId);
    });

    it('should throw a ForbiddenException if the user is not authorized to create a reservation', async () => {
      jest.spyOn(service, 'generateReservation').mockRejectedValue(new ForbiddenException());

      await expect(controller.createReservations(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw a NotFoundException if the cart does not exist', async () => {
      jest.spyOn(service, 'generateReservation').mockRejectedValue(new NotFoundException());

      await expect(controller.createReservations(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for a user', async () => {
      const userId = 1;
      const reservations = [{} as Reservation];

      jest.spyOn(service, 'findAll').mockResolvedValue(reservations);

      const result = await controller.findAll(userId);
      expect(result).toBe(reservations);
      expect(service.findAll).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new NotFoundException());

      await expect(controller.findAll(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllAdmin', () => {
    it('should return all reservations for an admin', async () => {
      const reservations = [{} as Reservation];

      jest.spyOn(service, 'findAllAdmin').mockResolvedValue(reservations);

      const result = await controller.findAllAdmin();
      expect(result).toBe(reservations);
      expect(service.findAllAdmin).toHaveBeenCalled();
    });

    it('should throw a ForbiddenException if the user is not an admin', async () => {
      jest.spyOn(service, 'findAllAdmin').mockRejectedValue(new ForbiddenException());

      await expect(controller.findAllAdmin()).rejects.toThrow(ForbiddenException);
    });

    it('should throw a NotFoundException if no reservations are found', async () => {
      jest.spyOn(service, 'findAllAdmin').mockRejectedValue(new NotFoundException());

      await expect(controller.findAllAdmin()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find a reservation by ID and user ID', async () => {
      const reservation = {} as Reservation;

      jest.spyOn(service, 'findOne').mockResolvedValue(reservation);

      const result = await controller.findOne('1', 1);
      expect(result).toBe(reservation);
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });

    it('should throw a NotFoundException if the reservation does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1', 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ForbiddenException if the user is not authorized to access the reservation', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new ForbiddenException());

      await expect(controller.findOne('1', 1)).rejects.toThrow(ForbiddenException);
    });
  });
});
