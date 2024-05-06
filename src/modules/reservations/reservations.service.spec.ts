import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Reservation } from './entities/reservation.entity';
import { UsersService } from '@modules/users/users.service';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { TicketsService } from '@modules/tickets/tickets.service';
import { PaymentService } from '@libs/payment/payment.service';
import { OrdersService } from '@modules/orders/orders.service';
import { Repository } from 'typeorm';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { NotFoundException } from '@nestjs/common';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { Order } from '@modules/orders/entities/order.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<Reservation>;
  let usersService: UsersService;
  let cartItemsService: CartItemsService;
  let cartService: CartsService;
  let paymentService: PaymentService;
  let ticketsService: TicketsService;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useClass: Repository
        },
        {
          provide: UsersService,
          useValue: {
            verifyUserOneBy: jest.fn()
          }
        },
        {
          provide: CartsService,
          useValue: {
            verifyCartRelation: jest.fn(),
            getOrCreateCart: jest.fn(),
            deleteCart: jest.fn()
          }
        },
        {
          provide: CartItemsService,
          useValue: {
            findAllItemsInCart: jest.fn(),
            removeAllItemFromCart: jest.fn()
          }
        },
        {
          provide: PaymentService,
          useValue: {
            processPayment: jest.fn()
          }
        },
        {
          provide: TicketsService,
          useValue: {
            generatedTickets: jest.fn()
          }
        },
        {
          provide: OrdersService,
          useValue: {
            createOrderFromReservation: jest.fn(),
            findOrderByReservationId: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    usersService = module.get<UsersService>(UsersService);
    cartItemsService = module.get<CartItemsService>(CartItemsService);
    cartService = module.get<CartsService>(CartsService);
    paymentService = module.get<PaymentService>(PaymentService);
    ticketsService = module.get<TicketsService>(TicketsService);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('createReservations', () => {
    it('should create reservations successfully', async () => {
      const user = new User();
      user.userId = 1;
      const cartId = 1;
      const cartItems: CartItem[] = [{ cartItemId: 1, price: 100 } as CartItem];
      const paymentResult: PaymentResult = {
        status: StatusReservation.APPROVED,
        detail: 'Payment successful'
      };
      const order: Order = {
        orderId: 1,
        reservation: {} as Reservation,
        event: {} as Event,
        priceFormula: PriceFormulaEnum.SOLO,
        totalPrice: 100,
        statusPayment: StatusReservation.APPROVED,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentId: 3,
        title: 'Test Order',
        description: 'Order for testing',
        quantity: 1
      };

      jest.spyOn(usersService, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(cartItemsService, 'findAllItemsInCart').mockResolvedValue(cartItems);
      jest.spyOn(cartService, 'verifyCartRelation').mockResolvedValue(undefined);
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue(paymentResult);
      jest.spyOn(reservationRepository, 'create').mockImplementation(dto => dto as Reservation);
      jest.spyOn(reservationRepository, 'save').mockResolvedValue({} as Reservation);
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(ordersService, 'createOrderFromReservation').mockResolvedValue(order);
      jest.spyOn(service as any, 'cleanUpAfterPayment').mockResolvedValue(undefined);

      const result = await service.createReservations(user.userId, cartId);
      expect(result).toHaveLength(cartItems.length);
      expect(service['cleanUpAfterPayment']).toHaveBeenCalledWith(cartId, user.userId);
    });

    it('should handle errors gracefully when creating reservations', async () => {
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue({
        status: StatusReservation.REJECTED,
        detail: 'Payment failed'
      });
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue({
        cartItem: { cartItemId: 1 },
        user: { userId: 1 }
      } as Reservation);
      jest
        .spyOn(cartItemsService, 'findAllItemsInCart')
        .mockResolvedValue([{ cartItemId: 1, price: 100 } as CartItem]);

      await expect(service.createReservations(1, 1)).rejects.toThrow(
        `Reservation already exists for item with ID 1.`
      );
    });
  });

  describe('issueTicketsForApprovedReservations', () => {
    it('should issue tickets for approved reservations', async () => {
      const reservations: Reservation[] = [
        {
          reservationId: 1,
          order: { statusPayment: StatusReservation.APPROVED },
          user: { userId: 1 }
        } as Reservation
      ];

      jest.spyOn(ordersService, 'findOrderByReservationId').mockResolvedValue({
        statusPayment: StatusReservation.APPROVED
      } as Order);
      jest.spyOn(ticketsService, 'generatedTickets').mockResolvedValue(undefined);

      await service.issueTicketsForApprovedReservations(reservations);
      expect(ticketsService.generatedTickets).toHaveBeenCalledWith(1, 1);
    });

    it('should skip issuing tickets for non-approved reservations', async () => {
      const reservations: Reservation[] = [
        {
          reservationId: 1,
          order: { statusPayment: StatusReservation.PENDING },
          user: { userId: 1 }
        } as Reservation
      ];

      jest.spyOn(ordersService, 'findOrderByReservationId').mockResolvedValue({
        statusPayment: StatusReservation.PENDING
      } as Order);

      await service.issueTicketsForApprovedReservations(reservations);
      expect(ticketsService.generatedTickets).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a reservation by ID and user ID', async () => {
      const reservation = {
        reservationId: 1,
        user: { userId: 1 },
        ticket: { ticketId: 1, qrCode: 'code' }
      } as Reservation;
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(reservation);

      const result = await service.findOne(1, 1);
      expect(result).toBe(reservation);
    });

    it('should throw NotFoundException if reservation is not found or does not belong to the user', async () => {
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveReservation', () => {
    it('should save a reservation', async () => {
      const reservation = new Reservation();
      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);

      const result = await service.saveReservation(reservation);
      expect(result).toBe(reservation);
    });
  });
});
