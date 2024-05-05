import { PriceFormulaEnum } from './enums/price-formula.enum';

export const NODE_ENV = 'NODE_ENV';
export const DEV_ENV = 'development';
export const PROD_ENV = 'production';

// Price formula multipliers
export const PRICES_FORMULA = [
  { type: PriceFormulaEnum.SOLO, multiplier: 1 },
  { type: PriceFormulaEnum.DUO, multiplier: 1.3 },
  { type: PriceFormulaEnum.FAMILY, multiplier: 1.8 }
];
