import { PartialType } from '@nestjs/swagger';
import { CreateReservationItemDto } from './create-reservation-item.dto';

export class UpdateReservationItemDto extends PartialType(CreateReservationItemDto) {}
