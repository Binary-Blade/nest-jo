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

@Injectable()
export class OffersService {
  private readonly TTL: number = 60 * 60;

  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly redisService: RedisService
  ) {}

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

  async remove(id: number): Promise<string> {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    await this.offerRepository.remove(offer);
    this.clearCache(id);
    return 'Offer deleted successfully';
  }

  private safeParse<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Error parsing JSON', error);
      throw new InternalServerErrorException('Error parsing data');
    }
  }

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
