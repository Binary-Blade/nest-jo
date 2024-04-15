import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { statusReservation } from '@common/enums/status-reservation.enum';
import { Ticket } from './entities/ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import * as qrcode from 'qrcode';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>
  ) {}

  async createReservations(
    userId: number,
    cartItems: CartItem[],
    status: statusReservation
  ): Promise<Reservation[]> {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    let createdReservations: Reservation[] = [];

    for (const item of cartItems) {
      const existingReservation = await this.reservationRepository.findOne({
        where: { cartItem: item, user: user }
      });

      if (existingReservation) {
        throw new Error(`Reservation for item with ID ${item.cartItemId} already exists.`);
      }

      const reservation = new Reservation();
      reservation.user = user;
      reservation.cartItem = item;
      reservation.paymentId = Math.floor(Math.random() * 1000); // Random payment ID
      reservation.totalPrice = item.offer.price * item.quantity;
      reservation.status = status; // Set the reservation status based on the parameter

      const savedReservation = await this.reservationRepository.save(reservation);
      createdReservations.push(savedReservation);
    }

    return createdReservations;
  }

  // TODO: Link to user and cartItem
  async findAll() {
    return await this.reservationRepository.find();
  }

  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

  async findOne(
    reservationId: number,
    userId: number
  ): Promise<{ reservation: Reservation; user: User }> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['user'] // Make sure you are loading the user relation
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }

    // Make sure the reservation belongs to the user
    if (reservation.user.userId !== userId) {
      throw new ForbiddenException(`Access to reservation with ID ${reservationId} is forbidden.`);
    }

    // Retrieve the user associated with the reservation
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return { reservation, user: reservation.user };
  }

  async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      if (reservation.status === statusReservation.APPROVED) {
        await this.confirmReservation(reservation.reservationId, reservation.user.userId);
      }
    }
  }
  private async confirmReservation(reservationId: number, userId: number): Promise<Ticket> {
    const { reservation, user } = await this.findOne(reservationId, userId);

    // Check if the reservation status is completed
    if (reservation.status !== statusReservation.APPROVED) {
      throw new Error('Reservation is not approved.');
    }

    // Generate purchase_key and secure_key
    const purchaseKey = uuidv4();
    const secureKey = `${user.accountKey}-${purchaseKey}`;
    const qrCodeUrl = await qrcode.toDataURL(secureKey);

    // Create the ticket with the generated keys and QR code
    const ticket = this.ticketRepository.create({
      reservation: reservation,
      purchaseKey: purchaseKey,
      secureKey: secureKey,
      qrCode: qrCodeUrl
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Update reservation with the ticket ID
    reservation.ticketId = savedTicket.ticketId;
    await this.reservationRepository.save(reservation);

    return savedTicket;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
