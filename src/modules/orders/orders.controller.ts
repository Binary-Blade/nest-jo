import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';

// TODO: Implement later ?
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
}
