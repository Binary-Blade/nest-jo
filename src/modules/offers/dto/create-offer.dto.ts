import { TypeOffer } from '@common/enums/type-offer.enum';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for creating an offer
 * @param title - The title of the offer
 * @param description - The description of the offer
 * @param price - The price of the offer
 * @param quantityAvailable - The quantity of the offer available
 * @param type - The type of the offer
 * @returns - The created offer
 */
export class CreateOfferDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantityAvailable: number;

  @IsNotEmpty()
  @IsString()
  readonly type: TypeOffer;
}
