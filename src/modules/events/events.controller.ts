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
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { Event } from './entities/event.entity';

/**
 * Controller to manage events.
 * @class
 */
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventPricesService: EventPricesService
  ) {}

  /**
   * Creates a new event. Only accessible to admins.
   *
   * @param {CreateEventDto} createEventDto - DTO containing event details.
   * @returns {Promise<Event>} - The created event.
   *
   * @example
   * POST /events/create
   * {
   *   "title": "Event Title",
   *   "description": "Event Description",
   *   "startDate": "2023-01-01",
   *   "endDate": "2023-01-02",
   *   "basePrice": 100
   * }
   */
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post('create')
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  /**
   * Retrieves filtered events based on pagination and filter parameters.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filter data.
   * @returns {Promise<{ events: Event[]; total: number }>} - The filtered events and total count.
   *
   * @example
   * GET /events/get-all-filtered?page=1&limit=10&sortBy=title&sortOrder=ASC
   */
  @Get('get-all-filtered')
  findAllFiltered(
    @Query() paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ events: Event[]; total: number }> {
    return this.eventsService.findAllFiltered(paginationFilterDto);
  }

  /**
   * Retrieves all event values.
   *
   * @returns {Promise<Event[]>} - All events with selected values.
   *
   * @example
   * GET /events/get-events-values
   */
  @Get('get-events-values')
  findAll(): Promise<Event[]> {
    return this.eventsService.findAllValues();
  }

  /**
   * Retrieves the price of a ticket for an event by its ID and price formula.
   *
   * @param {number} id - ID of the event.
   * @param {PriceFormulaEnum} priceFormula - The price formula type.
   * @returns {Promise<{ eventId: number; priceFormula: PriceFormulaEnum; price: number }>} - The event ID, price formula, and price.
   *
   * @example
   * GET /events/1/price/STANDARD
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
   * Retrieves a single event by its ID.
   *
   * @param {string} id - ID of the event.
   * @returns {Promise<Event>} - The found event.
   *
   * @example
   * GET /events/1
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(+id);
  }

  /**
   * Updates an existing event. Only accessible to admins.
   *
   * @param {string} id - ID of the event to update.
   * @param {UpdateEventDto} updateEventDto - DTO containing updated event details.
   * @returns {Promise<Event>} - The updated event.
   *
   * @example
   * PATCH /events/1
   * {
   *   "title": "Updated Title",
   *   "description": "Updated Description",
   *   "startDate": "2023-01-03",
   *   "endDate": "2023-01-04",
   *   "basePrice": 150
   * }
   */
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventsService.update(+id, updateEventDto);
  }

  /**
   * Deletes an event by its ID. Only accessible to admins.
   *
   * @param {string} id - ID of the event to delete.
   * @returns {Promise<string>} - Confirmation message.
   *
   * @example
   * DELETE /events/1
   */
  @Role(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.eventsService.remove(+id);
  }
}
