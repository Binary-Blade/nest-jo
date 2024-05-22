import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';

/**
 * Data Transfer Object (DTO) for updating a cart item.
 * Extends CreateCartItemDto with all properties optional.
 *
 * @class
 */
export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
