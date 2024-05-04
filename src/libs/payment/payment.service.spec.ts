import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService]
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  describe('processPayment', () => {
    it('should return rejected when cartTotal is 0', async () => {
      const result: PaymentResult = await service.processPayment(0);
      expect(result).toEqual({
        status: StatusReservation.REJECTED,
        detail: 'No items found in the cart to process.'
      });
    });

    it('should return approved when random is less than SUCCESS_RATE', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // less than 0.6 (SUCCESS_RATE)
      const result: PaymentResult = await service.processPayment(100);
      expect(result).toEqual({
        status: StatusReservation.APPROVED,
        detail: 'Payment processed successfully.'
      });
    });

    it('should return pending when random is between SUCCESS_RATE and SUCCESS_RATE + PENDING_RATE', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // between 0.6 and 0.8
      const result: PaymentResult = await service.processPayment(100);
      expect(result).toEqual({
        status: StatusReservation.PENDING,
        detail: 'Payment is pending confirmation.'
      });
    });

    it('should return rejected when random is greater than SUCCESS_RATE + PENDING_RATE', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9); // greater than 0.8
      const result: PaymentResult = await service.processPayment(100);
      expect(result).toEqual({
        status: StatusReservation.REJECTED,
        detail: 'Payment processing failed.'
      });
    });
  });
});
