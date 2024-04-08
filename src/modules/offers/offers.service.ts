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
  private readonly TTL: number = 60 * 60;

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
    const existingOffer = await this.offerRepository.findOneBy({
      title: createOfferDto.title
    });
    if (existingOffer) {
      throw new ConflictException('An offer with this title already exists.');
    }
    const offer: Offer = this.offerRepository.create({
      ...createOfferDto,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return this.offerRepository.save(offer);
  }

  /**
   * Get all offers
   *
   * @returns - List of all offers
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findAll(): Promise<Offer[]> {
    const cacheKey = 'offers_all';
    let offers = await this.redisService.get(cacheKey);

    if (!offers) {
      const dbOffers = await this.offerRepository.find();
      await this.redisService.set(cacheKey, JSON.stringify(dbOffers), this.TTL);
      return dbOffers;
    }

    return this.safeParse<Offer[]>(offers);
  }

  /**
   * Get a single offer by id
   *
   * @param id - The id of the offer to retrieve
   * @returns - The offer with the given id
   * @throws NotFoundException if the offer with the given id is not found
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async findOne(id: number): Promise<Offer> {
    const cacheKey = `offer_${id}`;
    let offer = await this.redisService.get(cacheKey);

    if (!offer) {
      const dbOffer = await this.offerRepository.findOneBy({ offerId: id });
      if (!dbOffer) {
        throw new NotFoundException(`Offer with id ${id} not found`);
      }
      await this.redisService.set(cacheKey, JSON.stringify(dbOffer), this.TTL);
      return dbOffer;
    }

    return this.safeParse<Offer>(offer);
  }

  /**
   * Update an offer
   *
   * @param id - The id of the offer to update
   * @param updateOfferDto - DTO for updating an offer
   * @returns - The updated offer
   * @throws NotFoundException if the offer with the given id is not found
   * @throws ConflictException if an offer with the same title already exists
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    const existingOffer = await this.offerRepository.findOneBy({
      title: updateOfferDto.title
    });

    if (existingOffer && existingOffer.offerId !== id) {
      throw new ConflictException('An offer with this title already exists.');
    }
    const updatedOffer = await this.offerRepository.save({
      ...offer,
      ...updateOfferDto,
      updatedAt: new Date()
    });

    this.clearCache(id);

    return updatedOffer;
  }

  /**
   * Remove an offer
   *
   * @param id - The id of the offer to remove
   * @returns - Success message
   * @throws NotFoundException if the offer with the given id is not found
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  async remove(id: number): Promise<string> {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    await this.offerRepository.remove(offer);
    this.clearCache(id);
    return 'Offer deleted successfully';
  }

  /**
   * Safely parse JSON data
   *
   * @param jsonString - The JSON data to parse
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
   * @param offerId - The id of the offer to clear cache for
   * @returns - Promise
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  private async clearCache(offerId?: number): Promise<void> {
    if (offerId) {
      // Invalidate cache for a specific offer
      await this.redisService.del(`offer_${offerId}`);
    } else {
      // Invalidate cache for the list of all offers
      await this.redisService.del('offers_all');
    }
  }
}
