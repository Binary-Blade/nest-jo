import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

/**
 * Array of price formulas with their respective multipliers.
 * @constant
 * @type {ReadonlyArray<{type: PriceFormulaEnum, multiplier: number}>}
 *
 * @example
 * const soloPrice = basePrice * PRICES_FORMULA[0].multiplier; // for SOLO
 */
export const PRICES_FORMULA: ReadonlyArray<{ type: PriceFormulaEnum; multiplier: number }> = [
  { type: PriceFormulaEnum.SOLO, multiplier: 1 },
  { type: PriceFormulaEnum.DUO, multiplier: 1.3 },
  { type: PriceFormulaEnum.FAMILY, multiplier: 1.8 }
] as const;

/**
 * Default page size constants for different entities.
 * @constant
 * @type {Readonly<Record<string, number>>}
 *
 * @example
 * const userPageSize = DEFAULT_PAGE_SIZE.USER;
 */
export const DEFAULT_PAGE_SIZE: Readonly<Record<string, number>> = {
  USER: 8,
  RESERVATION: 12,
  EVENT: 8
} as const satisfies Record<string, number>;
