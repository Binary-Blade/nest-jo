import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from '@security/encryption/encryption.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { StatusReservation } from '@common/enums/status-reservation.enum';

/**
 * Service to manage tickets.
 * @class
 */
@Injectable()
export class TicketsService {
  /**
   * Constructor for the TicketsService.
   *
   * @constructor
   * @param {Repository<Ticket>} ticketRepository - Repository for the Ticket entity.
   * @param {EncryptionService} encryptionService - Service to manage encryption.
   * @param {UsersService} usersService - Service to manage users.
   * @param {ReservationsService} reservationService - Service to manage reservations.
   * @param {TransactionsService} transactionService - Service to manage transactions.
   */
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private encryptionService: EncryptionService,
    private usersService: UsersService,
    @Inject(forwardRef(() => ReservationsService))
    private reservationService: ReservationsService,
    private transactionService: TransactionsService
  ) {}

  /**
   * Generates tickets for approved reservations.
   *
   * @param {Reservation[]} reservations - List of reservations to generate tickets for.
   * @returns {Promise<void>}
   *
   * @example
   * await ticketsService.generateTicketsForApprovedReservations(reservations);
   */
  async generateTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      const transaction = await this.transactionService.findTransactionByReservationId(
        reservation.reservationId
      );
      if (transaction && transaction.statusPayment === StatusReservation.APPROVED) {
        await this.generateTicketsForReservation(
          reservation.reservationId,
          reservation.user.userId
        );
      }
    }
  }

  /**
   * Generates tickets for a specific reservation.
   *
   * @param {number} reservationId - ID of the reservation.
   * @param {number} userId - ID of the user.
   * @returns {Promise<Ticket[]>} - List of generated tickets.
   *
   * @throws {NotFoundException} If the reservation is not found.
   *
   * @private
   *
   * @example
   * const tickets = await ticketsService.generateTicketsForReservation(1, 1);
   */
  private async generateTicketsForReservation(
    reservationId: number,
    userId: number
  ): Promise<Ticket[]> {
    const reservation = await this.reservationService.findOne(reservationId, userId);
    if (!reservation) throw new NotFoundException('Reservation not found');

    const user = await this.usersService.verifyUserOneBy(userId);
    const ticket = await this.createNewTicket(user, reservation);

    reservation.ticket = ticket;
    await this.reservationService.saveReservation(reservation);

    return [ticket];
  }

  /**
   * Creates a new ticket for a reservation.
   *
   * @param {User} user - The user entity.
   * @param {Reservation} reservation - The reservation entity.
   * @returns {Promise<Ticket>} - The created ticket.
   *
   * @private
   *
   * @example
   * const ticket = await ticketsService.createNewTicket(user, reservation);
   */
  private async createNewTicket(user: User, reservation: Reservation): Promise<Ticket> {
    const purchaseKey = await this.encryptionService.generatedKeyUuid();
    const secureKey = await this.encryptionService.generatedSecureKey(user);
    const qrCode = await this.encryptionService.generatedQRCode(secureKey);

    const ticket = this.ticketRepository.create({
      reservation,
      purchaseKey,
      secureKey,
      qrCode
    });
    return await this.ticketRepository.save(ticket);
  }
}
