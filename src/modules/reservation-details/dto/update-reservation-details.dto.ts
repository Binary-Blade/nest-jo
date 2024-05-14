import { PartialType } from '@nestjs/swagger';
import { CreateReservationDetailsDto } from './create-reservation-details.dto';

/**
 * Data transfer object for updating a reservation details.
 *
 * @export UpdateReservationDetailsrDto
 * @class UpdateReservationDetailsrDto
 * @extends {PartialType(CreateReservationDetailsDto)}
 */
export class UpdateReservationDetailsrDto extends PartialType(CreateReservationDetailsDto) {}
