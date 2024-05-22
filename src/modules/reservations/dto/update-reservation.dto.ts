import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';

/**
 * Data Transfer Object (DTO) for updating a reservation.
 * Extends CreateReservationDto with all properties optional.
 *
 * @class
 */
export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
