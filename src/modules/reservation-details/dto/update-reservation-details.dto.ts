import { PartialType } from '@nestjs/swagger';
import { CreateReservationDetailsDto } from './create-reservation-details.dto';

export class UpdateReservationDetailsrDto extends PartialType(CreateReservationDetailsDto) {}
