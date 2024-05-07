import { Controller } from '@nestjs/common';
import { ReservationDetailsService } from './reservation-details.service';

// TODO: Implement later ?
@Controller('reservation-details')
export class ReservationDetailsController {
  constructor(private readonly x: ReservationDetailsService) {}
}
