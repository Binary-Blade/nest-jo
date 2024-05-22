/**
 * Interface representing a collection of key-value pairs.
 *
 * @interface KeyValuePairs
 * @example
 * const data: KeyValuePairs = { key1: 'value1', key2: 42, key3: { nestedKey: 'nestedValue' } };
 */
export interface KeyValuePairs {
  /**
   * A key-value pair where the key is a string and the value can be of any type.
   * @type {any}
   *
   * @example
   * const data: KeyValuePairs = { key1: 'value1', key2: 42, key3: { nestedKey: 'nestedValue' } };
   */
  [key: string]: any;
}
