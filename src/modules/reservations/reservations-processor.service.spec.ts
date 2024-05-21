import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsProcessorService } from './reservations-processor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { EventSalesService } from '@modules/events/event-sales.service';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { UsersService } from '@modules/users/users.service';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { PaymentService } from '@libs/payment/payment.service';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';

describe('ReservationsProcessorService', () => {
  let service: ReservationsProcessorService;
  let reservationRepository: Repository<Reservation>;
  let usersService: UsersService;
  let cartItemsService: CartItemsService;
  let transactionService: TransactionsService;
  let paymentService: PaymentService;
  let eventSalesService: EventSalesService;
  let ticketsService: TicketsService;
  let reservationDetailsService: ReservationDetailsService;
  let cartsService: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsProcessorService,
        {
          provide: getRepositoryToken(Reservation),
          useClass: Repository
        },
        {
          provide: TicketsService,
          useValue: {
            generateTicketsForApprovedReservations: jest.fn()
          }
        },
        {
          provide: EventSalesService,
          useValue: {
            processEventTicketsAndRevenue: jest.fn()
          }
        },
        {
          provide: TransactionsService,
          useValue: {
            calculateCartTotal: jest.fn(),
            createTransaction: jest.fn()
          }
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
            deleteCart: jest.fn(),
            getOrCreateCart: jest.fn()
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
          provide: ReservationDetailsService,
          useValue: {
            createReservationDetailsFromReservation: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ReservationsProcessorService>(ReservationsProcessorService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    usersService = module.get<UsersService>(UsersService);
    cartItemsService = module.get<CartItemsService>(CartItemsService);
    transactionService = module.get<TransactionsService>(TransactionsService);
    paymentService = module.get<PaymentService>(PaymentService);
    eventSalesService = module.get<EventSalesService>(EventSalesService);
    ticketsService = module.get<TicketsService>(TicketsService);
    reservationDetailsService = module.get<ReservationDetailsService>(ReservationDetailsService);
    cartsService = module.get<CartsService>(CartsService);
  });

  describe('processUserReservation', () => {
    it('should process user reservation successfully', async () => {
      const user = { userId: 1 } as User;
      const cartItems = [
        {
          cartItemId: 1,
          event: { eventId: 1 },
          quantity: 1
        } as CartItem
      ];
      const paymentResult: PaymentResult = {
        status: StatusReservation.APPROVED,
        detail: 'Payment successful'
      };
      const transaction = {} as Transaction;
      const reservation = { reservationId: 1 } as Reservation;

      jest.spyOn(usersService, 'verifyUserOneBy').mockResolvedValue(user);
      jest.spyOn(cartItemsService, 'findAllItemsInCart').mockResolvedValue(cartItems);
      jest.spyOn(transactionService, 'calculateCartTotal').mockReturnValue(100);
      jest.spyOn(paymentService, 'processPayment').mockResolvedValue(paymentResult);
      jest.spyOn(transactionService, 'createTransaction').mockResolvedValue(transaction);
      jest
        .spyOn(service as any, 'createReservationsForAllCartItems')
        .mockResolvedValue([reservation]);
      jest.spyOn(service as any, 'finalizeBooking').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'cleanUpAfterPayment').mockResolvedValue(undefined);

      const result = await service.processUserReservation(user.userId, 1);
      expect(result).toEqual([reservation]);
      expect(service['createReservationsForAllCartItems']).toHaveBeenCalledWith(
        cartItems,
        user,
        transaction
      );
      expect(service['finalizeBooking']).toHaveBeenCalledWith(cartItems, [reservation]);
      expect(service['cleanUpAfterPayment']).toHaveBeenCalledWith(1, user.userId);
    });
  });

  describe('createReservationsForAllCartItems', () => {
    it('should create reservations for all cart items', async () => {
      const cartItems = [
        {
          cartItemId: 1,
          quantity: 1
        } as CartItem
      ];
      const user = { userId: 1 } as User;
      const transaction = {} as Transaction;
      const reservation = { reservationId: 1 } as Reservation;

      jest
        .spyOn(service as any, 'createReservationsForEachCartItem')
        .mockResolvedValue([reservation]);

      const result = await service['createReservationsForAllCartItems'](
        cartItems,
        user,
        transaction
      );
      expect(result).toEqual([reservation]);
      expect(service['createReservationsForEachCartItem']).toHaveBeenCalledWith(
        cartItems[0],
        user,
        transaction
      );
    });
  });

  describe('createReservationsForEachCartItem', () => {
    it('should create reservations for each cart item', async () => {
      const cartItem = { cartItemId: 1, quantity: 1 } as CartItem;
      const user = { userId: 1 } as User;
      const transaction = {} as Transaction;
      const reservation = { reservationId: 1 } as Reservation;

      jest.spyOn(service as any, 'preventDuplicateReservation').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'initiateReservation').mockResolvedValue(reservation);
      jest
        .spyOn(reservationDetailsService, 'createReservationDetailsFromReservation')
        .mockResolvedValue({} as any);
      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);

      const result = await service['createReservationsForEachCartItem'](
        cartItem,
        user,
        transaction
      );
      expect(result).toEqual([reservation]);
      expect(service['preventDuplicateReservation']).toHaveBeenCalledWith(cartItem, user);
      expect(service['initiateReservation']).toHaveBeenCalledWith(user, cartItem, transaction);
      expect(
        reservationDetailsService.createReservationDetailsFromReservation
      ).toHaveBeenCalledWith(reservation, cartItem);
      expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
    });

    it('should throw an error if a reservation already exists for the cart item', async () => {
      const cartItem = { cartItemId: 1, quantity: 1 } as CartItem;
      const user = { userId: 1 } as User;

      jest.spyOn(service as any, 'preventDuplicateReservation').mockImplementation(() => {
        throw new Error('Reservation already exists');
      });

      await expect(
        service['createReservationsForEachCartItem'](cartItem, user, {} as Transaction)
      ).rejects.toThrow('Reservation already exists');
    });
  });

  describe('initiateReservation', () => {
    it('should initiate a reservation successfully', async () => {
      const cartItem = { cartItemId: 1 } as CartItem;
      const user = { userId: 1 } as User;
      const transaction = {} as Transaction;
      const reservation = { reservationId: 1 } as Reservation;

      jest.spyOn(reservationRepository, 'create').mockReturnValue(reservation);
      jest.spyOn(reservationRepository, 'save').mockResolvedValue(reservation);

      const result = await service['initiateReservation'](user, cartItem, transaction);
      expect(result).toBe(reservation);
      expect(reservationRepository.create).toHaveBeenCalledWith({ user, cartItem, transaction });
      expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
    });
  });

  describe('finalizeBooking', () => {
    it('should finalize booking successfully', async () => {
      const cartItems = [{ cartItemId: 1, event: { eventId: 1 } } as CartItem];
      const reservations = [{ reservationId: 1 } as Reservation];

      jest.spyOn(eventSalesService, 'processEventTicketsAndRevenue').mockResolvedValue(undefined);
      jest
        .spyOn(ticketsService, 'generateTicketsForApprovedReservations')
        .mockResolvedValue(undefined);

      await service['finalizeBooking'](cartItems, reservations);
      expect(eventSalesService.processEventTicketsAndRevenue).toHaveBeenCalledWith([cartItems[0]]);
      expect(ticketsService.generateTicketsForApprovedReservations).toHaveBeenCalledWith(
        reservations
      );
    });
  });

  describe('preventDuplicateReservation', () => {
    it('should not throw an error if no duplicate reservation exists', async () => {
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service['preventDuplicateReservation']({} as CartItem, {} as User)
      ).resolves.not.toThrow();
    });

    it('should throw an error if a duplicate reservation exists', async () => {
      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue({} as Reservation);

      await expect(
        service['preventDuplicateReservation']({} as CartItem, {} as User)
      ).rejects.toThrow('Reservation already exists for item with ID undefined.');
    });
  });

  describe('cleanUpAfterPayment', () => {
    it('should clean up after payment successfully', async () => {
      jest.spyOn(cartItemsService, 'removeAllItemFromCart').mockResolvedValue(undefined);
      jest.spyOn(cartsService, 'deleteCart').mockResolvedValue(undefined);

      await service['cleanUpAfterPayment'](1, 1);
      expect(cartItemsService.removeAllItemFromCart).toHaveBeenCalledWith(1, 1);
      expect(cartsService.deleteCart).toHaveBeenCalledWith(1);
      expect(cartsService.getOrCreateCart).toHaveBeenCalledWith(1);
    });
  });
});
