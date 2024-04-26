import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from '@security/encryption/encryption.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { UsersService } from '@modules/users/users.service';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { User } from '@modules/users/entities/user.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';

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
    private reservationService: ReservationsService
  ) {}

  /**
   * Creates a ticket for a reservation.
   *
   * @param reservationId The ID of the reservation.
   * @param userId The ID of the user creating the ticket.
   * @returns A promise resolved with the created ticket.
   * @throws Error if the reservation is not approved.
   */
  async createTickets(reservationId: number, userId: number): Promise<Ticket> {
    const reservation = await this.reservationService.findOne(reservationId, userId);
    // Check if the reservation status is completed
    if (reservation.status !== StatusReservation.APPROVED) {
      throw new Error('Reservation is not approved.');
    }
    // Generate purchase_key and secure_key
    const user = await this.usersService.verifyUserOneBy(userId);
    const ticket = await this.createTicketForReservation(user, reservation);
    // Update reservation with the ticket ID
    reservation.ticketId = ticket.ticketId;
    await this.reservationService.saveReservation(reservation);
    return ticket;
  }

  /**
   * Creates a ticket for a reservation.
   *
   * @param user The user creating the ticket.
   * @param reservation The reservation for which the ticket is created.
   * @returns A promise resolved with the created ticket.
   */
  private async createTicketForReservation(user: User, reservation: Reservation): Promise<Ticket> {
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
