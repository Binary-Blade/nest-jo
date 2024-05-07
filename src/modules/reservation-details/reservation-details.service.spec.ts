import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailsService } from './reservation-details.service';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { NotFoundException } from '@nestjs/common';

// FIX: Update the test suite
describe('OrdersService', () => {
  let service: ReservationDetailsService;
  let orderRepository: Repository<ReservationDetails>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationDetailsService,
        {
          provide: getRepositoryToken(ReservationDetails),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<ReservationDetailsService>(ReservationDetailsService);
    orderRepository = module.get<Repository<ReservationDetails>>(
      getRepositoryToken(ReservationDetails)
    );
  });

  describe('createOrderFromReservation', () => {
    it('should create an order from a reservation', async () => {
      const reservation = { reservationId: 1 } as Reservation;
      const cartItem = {
        event: {
          eventId: 1,
          title: 'Test Event',
          description: 'A test event'
        },
        quantity: 2,
        priceFormula: PriceFormulaEnum.SOLO
      } as CartItem;
      const paymentResult: PaymentResult = {
        status: StatusReservation.APPROVED,
        detail: 'Payment successful'
      };
      const order = {} as ReservationDetails;

      jest.spyOn(orderRepository, 'create').mockReturnValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      const result = await service.createOrderFromReservation(
        reservation,
        cartItem,
        paymentResult,
        200
      );
      expect(result).toBe(order);
      expect(orderRepository.create).toHaveBeenCalledWith({
        paymentId: expect.any(Number),
        title: cartItem.event.title,
        description: cartItem.event.description,
        statusPayment: paymentResult.status,
        quantity: cartItem.quantity,
        totalPrice: 200,
        priceFormula: cartItem.priceFormula,
        event: { eventId: cartItem.event.eventId },
        reservation: { reservationId: reservation.reservationId }
      });
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });
  });

  describe('findOrderByReservationId', () => {
    it('should return an order by reservation ID', async () => {
      const order = {} as ReservationDetails;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);

      const result = await service.findOrderByReservationId(1);
      expect(result).toBe(order);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { reservation: { reservationId: 1 } },
        relations: ['reservation']
      });
    });

    it('should throw NotFoundException if order does not exist', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOrderByReservationId(1)).rejects.toThrow(NotFoundException);
    });
  });
});
