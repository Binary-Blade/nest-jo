import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

/**
 * Data transfer object for updating an event.
 *
 * @export UpdateEventDto
 * @class UpdateEventDto
 * @extends {PartialType(CreateEventDto)}
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {}
