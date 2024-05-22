/**
 * Enumeration for different pricing formulas.
 * @enum {string}
 */
export enum PriceFormulaEnum {
  /**
   * Pricing formula for a single person.
   * @example
   * PriceFormulaEnum.SOLO
   */
  SOLO = 'SOLO',

  /**
   * Pricing formula for two people.
   * @example
   * PriceFormulaEnum.DUO
   */
  DUO = 'DUO',

  /**
   * Pricing formula for a family.
   * @example
   * PriceFormulaEnum.FAMILY
   */
  FAMILY = 'FAMILY'
}
