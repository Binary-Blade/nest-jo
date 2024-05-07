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
 * Service responsible for handling tickets.
 * This service is used to create tickets for reservations.
 */
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private encryptionService: EncryptionService,
    private usersService: UsersService,
    @Inject(forwardRef(() => ReservationsService)) // Inject the ReservationsService with forwardRef
    private reservationService: ReservationsService,
    private transactionService: TransactionsService
  ) {}

  /**
   * Generate tickets for all approved reservations.
   *
   * @param reservations - The reservations to generate tickets for
   * @returns A promise that resolves when all tickets are generated
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
   * Generate tickets for a reservation.
   *
   * @private This method is private and should not be accessed from outside the service.
   * @param reservationId - The ID of the reservation to generate tickets for
   * @param userId - The ID of the user making the request
   * @returns - A list of tickets created
   * @throws NotFoundException if the reservation does not exist
   */
  private async generateTicketsForReservation(
    reservationId: number,
    userId: number
  ): Promise<Ticket[]> {
    const reservation = await this.reservationService.findOne(reservationId, userId);
    if (!reservation) throw new NotFoundException('Reservation not found');

    const user = await this.usersService.verifyUserOneBy(userId);
    const ticket = await this.createNewTicket(user, reservation);

    // Attach the ticket to the reservation and save it
    reservation.ticket = ticket;
    await this.reservationService.saveReservation(reservation);

    return [ticket]; // Return the created ticket in an array for consistency
  }

  /**
   * Creates a ticket for a reservation.
   *
   * @private This method is private and should not be accessed from outside the service.
   * @param user The user creating the ticket.
   * @param reservation The reservation for which the ticket is created.
   * @returns A promise resolved with the created ticket.
   */
  private async createNewTicket(user: User, reservation: Reservation): Promise<Ticket> {
    const purchaseKey = await this.encryptionService.generatedKeyUuid();
    const secureKey = await this.encryptionService.generatedSecureKey(user);
    const qrCode = await this.encryptionService.generatedQRCode(secureKey);

    // Create the ticket with the generated keys and QR code
    const ticket = this.ticketRepository.create({
      reservation,
      purchaseKey,
      secureKey,
      qrCode
    });
    return await this.ticketRepository.save(ticket);
  }
}
