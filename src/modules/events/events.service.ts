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

/**
 * Service responsible for handling CRUD operations for events
 */
@Injectable()
export class EventsService {
  // Time to live for cache in seconds - 1 hour
  private readonly TTL: number = 3600;

  // Inject the event repository and the Redis service
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private readonly redisService: RedisService
  ) {}

  /**
   * Create a new event
   *
   * @param createEventDto - DTO for creating an event
   * @returns - The created event
   * @throws ConflictException if an event with the same title already exists
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    await this.ensureTitleUnique(createEventDto.title);
    const event: Event = this.eventRepository.create(createEventDto);
    await this.eventRepository.save(event);
    return event;
  }

  /**
   * Get all event
   *
   * @returns - List of all events
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findAll(): Promise<Event[]> {
    return this.fetchCachedData('events_all', () => this.eventRepository.find());
  }

  /**
   * Get a single event by ID
   *
   * @param id - The ID of the event
   * @returns - The event with the given ID
   * @throws NotFoundException if the event with the given ID does not exist
   */
  async findOne(id: number): Promise<Event> {
    const event = await this.fetchCachedData(`event_${id}`, () =>
      this.eventRepository.findOneBy({ eventId: id })
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

    Object.assign(event, updateEventDto, { updatedAt: new Date() });

    await this.eventRepository.save(event);
    await this.clearCache(id);
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

    await this.eventRepository.remove(event);
    await this.clearCache(id);
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
   * Fetch data from cache if available, otherwise fetch from the database
   *
   * @private - This method should not be exposed to the controller
   * @param key - The key to use for caching
   * @param fetchFn - Function to fetch data if not available in cache
   * @returns - The fetched data
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  private async fetchCachedData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    let data = await this.redisService.get(key);
    if (!data) {
      const result = await fetchFn();
      await this.redisService.set(key, JSON.stringify(result), this.TTL);
      return result;
    }
    return this.safeParse(data);
  }

  /**
   * Safely parse JSON data
   *
   * @private - This method should not be exposed to the controller
   * @template T - The type of the data to parse
   * @param jsonString - The JSON string to parse
   * @returns - The parsed data
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  private safeParse<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Error parsing JSON', error);
      throw new InternalServerErrorException('Error parsing data');
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
  private async clearCache(eventId?: number): Promise<void> {
    const key = eventId ? `event_${eventId}` : 'events_all';
    await this.redisService.del(key);
  }
}
