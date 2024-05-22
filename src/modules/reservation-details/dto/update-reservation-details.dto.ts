import { PartialType } from '@nestjs/swagger';
import { CreateReservationDetailsDto } from './create-reservation-details.dto';

/**
 * Data Transfer Object (DTO) for updating reservation details.
 * Extends CreateReservationDetailsDto with all properties optional.
 *
 * @class
 */
export class UpdateReservationDetailsDto extends PartialType(CreateReservationDetailsDto) {}
