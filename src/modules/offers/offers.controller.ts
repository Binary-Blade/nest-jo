import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { UserRole } from '@common/enums/user-role.enum';
import { Role } from '@common/decorators/role.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';

/**
 * Controller responsible for handling requests to the /offers route
 */
@Controller('offers')
export class OffersController {
  // Inject the offers service
  constructor(private readonly offersService: OffersService) {}

  /**
   * Create a new offer
   *
   * @param createOfferDto - DTO for creating an offer
   * @returns - The created offer
   * @throws ConflictException if an offer with the same title already exists
   */
  @Role(UserRole.ADMIN) // Only admins can create offers
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Post('create')
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  /**
   * Get all offers
   *
   * @returns - List of all offers
   * @throws InternalServerErrorException if there is an error parsing the data
   */
  @Get('get-all')
  findAll() {
    return this.offersService.findAll();
  }

  /**
   * Get a single offer by ID
   *
   * @param id - The ID of the offer
   * @returns - The offer with the given ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
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
  @Role(UserRole.ADMIN) // Only admins can update offers
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }

  /**
   * Remove an offer by ID
   *
   * @param id - The ID of the offer
   * @returns - The removed offer
   * @throws NotFoundException if the offer with the given ID does not exist
   */
  @Role(UserRole.ADMIN) // Only admins can delete offers
  @UseGuards(AccessTokenGuard, RoleGuard) // Use the access token and role guards
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
