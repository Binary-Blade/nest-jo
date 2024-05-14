import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common';
import { UserRole } from '@common/enums/user-role.enum';
import { Role } from '@common/decorators/role.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { EventPricesService } from './event-prices.service';
import { PaginationAndFilterDto } from '@common/dto/pagination-filter.dto';

/**
 * Controller responsible for handling requests to the /events route
 * This controller is used to manage events, including creating, updating, and deleting events.
 */
@Controller('events')
export class EventsController {
  // Inject the events service
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventPricesService: EventPricesService
  ) {}

  /**
   * Create a new event
   *
   * @param createEventDto - DTO for creating an event
   * @returns - The created event
   * @throws ConflictException if an event with the same title already exists
   */
  @Role(UserRole.ADMIN) // Only admins can create events
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Post('create')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  /**
   * Get all events
   *
   * @returns - List of all events
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  @Get('get-all-filtered')
  findAllFiltered(@Query() paginationFilterDto: PaginationAndFilterDto) {
    return this.eventsService.findAllFiltered(paginationFilterDto);
  }

  @Get('get-events-values')
  findAll() {
    return this.eventsService.findAllValues();
  }

  /**
   * Get the price of a ticket for a given event and ticket type
   *
   * @param id - The ID of the event
   * @param ticketType - The type of ticket
   * @returns - The price of the ticket
   */
  @Get(':id/price/:priceFormula')
  async getTicketPrice(
    @Param('id') id: number,
    @Param('priceFormula') priceFormula: PriceFormulaEnum
  ): Promise<{ eventId: number; priceFormula: PriceFormulaEnum; price: number }> {
    const price = await this.eventPricesService.getPriceByEventAndType(+id, priceFormula);
    return { eventId: +id, priceFormula, price };
  }

  /**
   * Get a single event by ID
   *
   * @param id - The ID of the event
   * @returns - The event with the given ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  /**
   * Update an event by ID
   *
   * @param id - The ID of the event
   * @param updateEventDto - DTO for updating an event
   * @returns - The updated event
   * @throws NotFoundException if the event with the given ID does not exist
   * @throws ConflictException if an event with the same title already exists
   */
  @Role(UserRole.ADMIN) // Only admins can update events
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  /**
   * Remove an event by ID
   *
   * @param id - The ID of the event
   * @returns - The removed event
   * @throws NotFoundException if the event with the given ID does not exist
   */
  @Role(UserRole.ADMIN) // Only admins can delete events
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
