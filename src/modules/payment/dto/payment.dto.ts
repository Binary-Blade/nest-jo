export class PaymentDto {
  userId: number;
  cartId: number;
  amount: number;
  currency: string;
  source: string; // Simule a payment source
}
