import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';
import { EventPricesService } from './event-prices.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { QueryHelperService } from '@database/query/query-helper.service';

/**
 * Service to manage events.
 * @class
 */
@Injectable()
export class EventsService {
  private static readonly CACHE_TTL_ONE_HOUR: number = 360; // TTL 360 seconds

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private readonly redisService: RedisService,
    private readonly eventPricesService: EventPricesService,
    private readonly convertUtilsService: ConvertUtilsService,
    private readonly queryHelper: QueryHelperService
  ) {}

  /**
   * Creates a new event.
   *
   * @param {CreateEventDto} createEventDto - DTO containing event details.
   * @returns {Promise<Event>} - The created event.
   *
   * @throws {ConflictException} If an event with the same title already exists.
   *
   * @example
   * const event = await eventsService.create(createEventDto);
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const startDate = this.convertUtilsService.convertDateStringToDate(createEventDto.startDate);
    const endDate = this.convertUtilsService.convertDateStringToDate(createEventDto.endDate);
    await this.ensureTitleUnique(createEventDto.title);
    const event: Event = this.eventRepository.create({
      ...createEventDto,
      startDate,
      endDate
    });
    await this.eventRepository.save(event);
    await this.eventPricesService.createEventPrices(event.eventId, event.basePrice);
    await this.redisService.clearCacheEvent();
    return event;
  }

  /**
   * Retrieves all event values.
   *
   * @returns {Promise<Event[]>} - All events with selected values.
   *
   * @example
   * const events = await eventsService.findAllValues();
   */
  async findAllValues(): Promise<Event[]> {
    return this.eventRepository.find({
      select: {
        quantityAvailable: true,
        quantitySold: true,
        revenueGenerated: true
      }
    });
  }

  /**
   * Retrieves events with pagination and filtering.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filtering data.
   * @returns {Promise<{ events: Event[]; total: number }>} - The filtered events and total count.
   *
   * @throws {InternalServerErrorException} If an error occurs while retrieving events.
   *
   * @example
   * const result = await eventsService.findAllFiltered(paginationFilterDto);
   */
  async findAllFiltered(
    paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ events: Event[]; total: number }> {
    const queryOptions = this.queryHelper.buildQueryOptions<Event>(paginationFilterDto);

    try {
      const [events, total] = await this.eventRepository.findAndCount(queryOptions);
      return { events, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve events', error.message);
    }
  }

  /**
   * Retrieves a single event by its ID.
   *
   * @param {number} id - ID of the event.
   * @returns {Promise<Event>} - The found event.
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @example
   * const event = await eventsService.findOne(1);
   */
  async findOne(id: number): Promise<Event> {
    const event = await this.redisService.fetchCachedData(
      `event_${id}`,
      () => this.eventRepository.findOneBy({ eventId: id }),
      EventsService.CACHE_TTL_ONE_HOUR
    );
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
  }

  /**
   * Updates an existing event.
   *
   * @param {number} id - ID of the event to update.
   * @param {UpdateEventDto} updateEventDto - DTO containing updated event details.
   * @returns {Promise<Event>} - The updated event.
   *
   * @throws {ConflictException} If an event with the new title already exists.
   * @throws {NotFoundException} If the event to update is not found.
   *
   * @example
   * const updatedEvent = await eventsService.update(1, updateEventDto);
   */
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    if (updateEventDto.title && updateEventDto.title !== event.title) {
      await this.ensureTitleUnique(updateEventDto.title, id);
    }
    if (updateEventDto.basePrice !== undefined && updateEventDto.basePrice !== event.basePrice) {
      await this.eventPricesService.updateEventPrices(event.eventId, updateEventDto.basePrice);
    }

    Object.assign(event, updateEventDto, { updatedAt: new Date() });

    await this.redisService.clearCacheEvent(id);
    await this.eventRepository.save(event);
    return event;
  }

  /**
   * Deletes an event by its ID.
   *
   * @param {number} id - ID of the event to delete.
   * @returns {Promise<string>} - Confirmation message.
   *
   * @throws {NotFoundException} If the event to delete is not found.
   *
   * @example
   * const message = await eventsService.remove(1);
   */
  async remove(id: number): Promise<string> {
    const event = await this.findOne(id);
    await this.eventPricesService.deleteEventPrices(id);
    await this.eventRepository.remove(event);
    await this.redisService.clearCacheEvent(id);
    return 'Event deleted successfully.';
  }

  /**
   * Ensures that the event title is unique.
   *
   * @param {string} title - Title of the event.
   * @param {number} [excludeId] - Optional ID to exclude from the uniqueness check.
   * @returns {Promise<void>}
   *
   * @throws {ConflictException} If an event with the same title already exists.
   *
   * @private
   *
   * @example
   * await eventsService.ensureTitleUnique('New Event');
   */
  private async ensureTitleUnique(title: string, excludeId?: number): Promise<void> {
    const existingEvent = await this.eventRepository.findOneBy({ title });
    if (existingEvent && existingEvent.eventId !== excludeId) {
      throw new ConflictException('An event with this title already exists.');
    }
  }

  /**
   * Finds an event by its ID.
   *
   * @param {number} eventId - ID of the event.
   * @returns {Promise<Event>} - The found event.
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @example
   * const event = await eventsService.findEventById(1);
   */
  async findEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with ID ${eventId} not found.`);
    return event;
  }
}
