import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';

/**
 * Service responsible for handling CRUD operations for offers
 */
@Injectable()
export class OffersService {
  // Time to live for cache in seconds - 1 hour
  private readonly TTL: number = 3600;

  // Inject the offer repository and the Redis service
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly redisService: RedisService
  ) {}

  /**
   * Create a new offer
   *
   * @param createOfferDto - DTO for creating an offer
   * @returns - The created offer
   * @throws ConflictException if an offer with the same title already exists
   */
  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    await this.ensureTitleUnique(createOfferDto.title);
    const offer: Offer = this.offerRepository.create(createOfferDto);
    await this.offerRepository.save(offer);
    return offer;
  }

  /**
   * Get all offers
   *
   * @returns - List of all offers
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findAll(): Promise<Offer[]> {
    return this.fetchCachedData('offers_all', () => this.offerRepository.find());
  }

  /**
   * Get a single offer by ID
   *
   * @param id - The ID of the offer
   * @returns - The offer with the given ID
   * @throws NotFoundException if the offer with the given ID does not exist
   */
  async findOne(id: number): Promise<Offer> {
    const offer = await this.fetchCachedData(`offer_${id}`, () =>
      this.offerRepository.findOneBy({ offerId: id })
    );
    if (!offer) throw new NotFoundException(`Offer with id ${id} not found`);
    return offer;
  }

  /**
   * Update an offer by ID
   *
   * @param id - The ID of the offer
   * @param updateOfferDto - DTO for updating an offer
   * @returns - The updated offer
   * @throws NotFoundException if the offer with the given ID does not exist
   * @throws ConflictException if an offer with the same title already exists
   */
  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findOne(id);
    await this.ensureTitleUnique(updateOfferDto.title, id);

    Object.assign(offer, updateOfferDto, { updatedAt: new Date() });

    await this.offerRepository.save(offer);
    await this.clearCache(id);
    return offer;
  }

  /**
   * Remove an offer by ID
   *
   * @param id - The ID of the offer
   * @returns - The removed offer
   * @throws NotFoundException if the offer with the given ID does not exist
   */
  async remove(id: number): Promise<string> {
    const offer = await this.findOne(id);
    if (!offer) throw new NotFoundException(`Offer with id ${id} not found`);

    await this.offerRepository.remove(offer);
    await this.clearCache(id);
    return 'Offer deleted successfully.';
  }

  /**
   * Ensure that an offer with the given title does not already exist
   *
   * @private - This method should not be exposed to the controller
   * @param title - The title to check
   * @param excludeId - The ID of the offer to exclude from the check
   * @returns - Promise that resolves if the title is unique
   * @throws ConflictException if an offer with the same title already exists
   */
  private async ensureTitleUnique(title: string, excludeId?: number): Promise<void> {
    const existingOffer = await this.offerRepository.findOneBy({ title });
    if (existingOffer && existingOffer.offerId !== excludeId) {
      throw new ConflictException('An offer with this title already exists.');
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
   * Clear cache for a specific offer or all offers
   *
   * @private - This method should not be exposed to the controller
   * @param offerId - The ID of the offer to clear cache for
   * @returns - Promise that resolves when the cache is cleared
   * @throws InternalServerErrorException if there is an error clearing the cache
   */
  private async clearCache(offerId?: number): Promise<void> {
    const key = offerId ? `offer_${offerId}` : 'offers_all';
    await this.redisService.del(key);
  }
}
