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
import { ConvertUtilsService } from '@utils/convert-utils.service';
import { EventPricesService } from './event-prices.service';

/**
 * Service responsible for handling CRUD operations for events
 */
@Injectable()
export class EventsService {
  private static readonly CACHE_TTL_ONE_HOUR: number = 360; // TTL 360 seconds

  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private readonly redisService: RedisService,
    private readonly eventPricesService: EventPricesService,
    private readonly convertUtilsService: ConvertUtilsService
  ) {}

  /**
   * Create a new event
   *
   * @param createEventDto - DTO for creating an event
   * @returns - The created event
   * @throws ConflictException if an event with the same title already exists
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
   * Get all event
   *
   * @returns - List of all events
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findAll(): Promise<Event[]> {
    try {
      return this.redisService.fetchCachedData(
        'events_all',
        () =>
          this.eventRepository.find({
            relations: ['prices']
          }),
        EventsService.CACHE_TTL_ONE_HOUR
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve events.');
    }
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
      EventsService.CACHE_TTL_ONE_HOUR
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
   * Remove an event by ID
   *
   * @param id - The ID of the event
   * @returns - The removed event
   * @throws NotFoundException if the event with the given ID does not exist
   */
  async remove(id: number): Promise<string> {
    const event = await this.findOne(id);
    await this.eventPricesService.deleteEventPrices(id);
    await this.eventRepository.remove(event);
    await this.redisService.clearCacheEvent(id);
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
   * Find an event by ID
   *
   * @param eventId - The ID of the event
   * @returns - The event with the given ID
   * @throws NotFoundException if the event with the given ID does not exist
   */
  async findEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with ID ${eventId} not found.`);
    return event;
  }
}
