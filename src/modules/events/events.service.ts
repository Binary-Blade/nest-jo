import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventPricesService } from '@modules/event-prices/event-prices.service';
import { UtilsService } from '@common/utils/utils.service';

/**
 * Service responsible for handling CRUD operations for events
 */
@Injectable()
export class EventsService {
  // Time to live for cache in seconds - 1 hour
  private readonly TTL_OneHour: number = 3600;

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private readonly redisService: RedisService,
    private readonly eventPricesService: EventPricesService,
    private readonly utilsService: UtilsService
  ) {}

  /**
   * Create a new event
   *
   * @param createEventDto - DTO for creating an event
   * @returns - The created event
   * @throws ConflictException if an event with the same title already exists
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const startDate = this.utilsService.convertDateStringToDate(createEventDto.startDate);
    const endDate = this.utilsService.convertDateStringToDate(createEventDto.endDate);
    await this.ensureTitleUnique(createEventDto.title);
    const event: Event = this.eventRepository.create({
      ...createEventDto,
      startDate,
      endDate
    });
    await this.eventRepository.save(event);
    await this.eventPricesService.createEventPrices(event.eventId, event.basePrice);
    await this.clearCacheEvent();
    return event;
  }

  /**
   * Get all event
   *
   * @returns - List of all events
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findAll(): Promise<Event[]> {
    return this.redisService.fetchCachedData(
      'events_all',
      () =>
        this.eventRepository.find({
          relations: ['prices']
        }),
      this.TTL_OneHour
    );
  }

  /**
   * Get a single event by ID
   *
   * @param id - The ID of the event
   * @returns - The event with the given ID
   * @throws NotFoundException if the event with the given ID does not exist
   */
  async findOne(id: number): Promise<Event> {
    const event = await this.redisService.fetchCachedData(
      `event_${id}`,
      () => this.eventRepository.findOneBy({ eventId: id }),
      this.TTL_OneHour
    );
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
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
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    await this.ensureTitleUnique(updateEventDto.title, id);

    // Check if basePrice has changed and needs updating
    const isBasePriceUpdated =
      updateEventDto.basePrice && updateEventDto.basePrice !== event.basePrice;

    // Update event with new data
    Object.assign(event, updateEventDto, { updatedAt: new Date() });
    await this.eventRepository.save(event);

    // If basePrice has changed, update related prices
    if (isBasePriceUpdated) {
      await this.eventPricesService.updateEventPrices(id, updateEventDto.basePrice);
    }

    await this.clearCacheEvent(id);
    return event;
  }

  /**
   * Remove an event by ID
   *
   * @param id - The ID of the event
   * @returns - The removed event
   * @throws NotFoundException if the event with the given ID does not exist
   */
  async remove(id: number): Promise<string> {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);

    await this.eventPricesService.deleteEventPrices(id);

    await this.eventRepository.remove(event);
    await this.clearCacheEvent(id);
    return 'Event deleted successfully.';
  }
  /**
   * Ensure that an event with the given title does not already exist
   *
   * @private - This method should not be exposed to the controller
   * @param title - The title to check
   * @param excludeId - The ID of the event to exclude from the check
   * @returns - Promise that resolves if the title is unique
   * @throws ConflictException if an event with the same title already exists
   */
  private async ensureTitleUnique(title: string, excludeId?: number): Promise<void> {
    const existingEvent = await this.eventRepository.findOneBy({ title });
    if (existingEvent && existingEvent.eventId !== excludeId) {
      throw new ConflictException('An event with this title already exists.');
    }
  }

  /**
   * Clear cache for a specific event or all events
   *
   * @private - This method should not be exposed to the controller
   * @param eventId - The ID of the event to clear cache for
   * @returns - Promise that resolves when the cache is cleared
   * @throws InternalServerErrorException if there is an error clearing the cache
   */
  private async clearCacheEvent(eventId?: number): Promise<void> {
    if (eventId) {
      await this.redisService.del(`event_${eventId}`);
    }
    await this.redisService.del('events_all');
  }
}
