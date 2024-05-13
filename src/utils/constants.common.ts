import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

// Price formula multipliers
export const PRICES_FORMULA = [
  { type: PriceFormulaEnum.SOLO, multiplier: 1 },
  { type: PriceFormulaEnum.DUO, multiplier: 1.3 },
  { type: PriceFormulaEnum.FAMILY, multiplier: 1.8 }
] as const;

export const DEFAULT_PAGE_SIZE = {
  USER: 10
} as const satisfies Record<string, number>;
