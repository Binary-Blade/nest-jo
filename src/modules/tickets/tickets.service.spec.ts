import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from '@security/encryption/encryption.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: Repository<Ticket>;
  let encryptionService: EncryptionService;
  let reservationsService: ReservationsService;
  let usersService: UsersService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository
        },
        {
          provide: EncryptionService,
          useValue: {
            generatedKeyUuid: jest.fn(),
            generatedSecureKey: jest.fn(),
            generatedQRCode: jest.fn()
          }
        },
        {
          provide: ReservationsService,
          useValue: {
            findOne: jest.fn(),
            saveReservation: jest.fn()
          }
        },
        {
          provide: UsersService,
          useValue: {
            verifyUserOneBy: jest.fn()
          }
        },
        {
          provide: TransactionsService,
          useValue: {
            findTransactionByReservationId: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    encryptionService = module.get<EncryptionService>(EncryptionService);
    reservationsService = module.get<ReservationsService>(ReservationsService);
    usersService = module.get<UsersService>(UsersService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  describe('generateTicketsForApprovedReservations', () => {
    it('should generate tickets for approved reservations', async () => {
      const reservation = { reservationId: 1, user: { userId: 1 } } as Reservation;
      const transaction = { statusPayment: StatusReservation.APPROVED } as any;

      jest
        .spyOn(transactionsService, 'findTransactionByReservationId')
        .mockResolvedValue(transaction);
      jest.spyOn(service as any, 'generateTicketsForReservation').mockResolvedValue([{} as Ticket]);

      await service.generateTicketsForApprovedReservations([reservation]);

      expect(transactionsService.findTransactionByReservationId).toHaveBeenCalledWith(1);
      expect(service['generateTicketsForReservation']).toHaveBeenCalledWith(1, 1);
    });

    it('should not generate tickets for non-approved reservations', async () => {
      const reservation = { reservationId: 1 } as Reservation;
      const transaction = { statusPayment: StatusReservation.REJECTED } as any;

      jest
        .spyOn(transactionsService, 'findTransactionByReservationId')
        .mockResolvedValue(transaction);
      jest.spyOn(service as any, 'generateTicketsForReservation').mockResolvedValue([{} as Ticket]);

      await service.generateTicketsForApprovedReservations([reservation]);

      expect(transactionsService.findTransactionByReservationId).toHaveBeenCalledWith(1);
      expect(service['generateTicketsForReservation']).not.toHaveBeenCalled();
    });
  });

  describe('generateTicketsForReservation', () => {
    it('should generate tickets for a reservation', async () => {
      const reservation = { reservationId: 1, user: { userId: 1 } } as Reservation;
      const user = { userId: 1 } as User;
      const ticket = {} as Ticket;

      jest.spyOn(reservationsService, 'findOne').mockResolvedValue(reservation);
      jest.spyOn(usersService, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(service as any, 'createNewTicket').mockResolvedValue(ticket);
      jest.spyOn(reservationsService, 'saveReservation').mockResolvedValue(reservation);

      const result = await service['generateTicketsForReservation'](1, 1);
      expect(result).toEqual([ticket]);
      expect(reservationsService.findOne).toHaveBeenCalledWith(1, 1);
      expect(usersService.verifyUserOneBy).toHaveBeenCalledWith(1);
      expect(service['createNewTicket']).toHaveBeenCalledWith(user, reservation);
      expect(reservationsService.saveReservation).toHaveBeenCalledWith(reservation);
    });

    it('should throw NotFoundException if the reservation does not exist', async () => {
      jest.spyOn(reservationsService, 'findOne').mockResolvedValue(null);

      await expect(service['generateTicketsForReservation'](1, 1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createNewTicket', () => {
    it('should create a new ticket successfully', async () => {
      const reservation = { reservationId: 1 } as Reservation;
      const user = { userId: 1 } as User;
      const ticket = {} as Ticket;

      jest.spyOn(encryptionService, 'generatedKeyUuid').mockResolvedValue('purchaseKey');
      jest.spyOn(encryptionService, 'generatedSecureKey').mockResolvedValue('secureKey');
      jest.spyOn(encryptionService, 'generatedQRCode').mockResolvedValue('qrCode');
      jest.spyOn(ticketRepository, 'create').mockReturnValue(ticket);
      jest.spyOn(ticketRepository, 'save').mockResolvedValue(ticket);

      const result = await service['createNewTicket'](user, reservation);
      expect(result).toBe(ticket);
      expect(encryptionService.generatedKeyUuid).toHaveBeenCalled();
      expect(encryptionService.generatedSecureKey).toHaveBeenCalledWith(user);
      expect(encryptionService.generatedQRCode).toHaveBeenCalledWith('secureKey');
      expect(ticketRepository.create).toHaveBeenCalledWith({
        reservation,
        purchaseKey: 'purchaseKey',
        secureKey: 'secureKey',
        qrCode: 'qrCode'
      });
      expect(ticketRepository.save).toHaveBeenCalledWith(ticket);
    });
  });
});
