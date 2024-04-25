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

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>, // Repository for accessing User entity operations.
    private encryptionService: EncryptionService,
    @Inject(forwardRef(() => ReservationsService))
    private reservationService: ReservationsService,
    private usersService: UsersService
  ) {}

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
