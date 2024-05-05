import { PartialType } from '@nestjs/swagger';
import { CreateEventPriceDto } from './create-event-price.dto';

export class UpdateEventPriceDto extends PartialType(CreateEventPriceDto) {}
