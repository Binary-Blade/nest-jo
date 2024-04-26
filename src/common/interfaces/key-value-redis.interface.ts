/**
 * Interface for key-value pairs
 *
 * @property {string} key - The key of the key-value pair.
 * @property {any} value - The value of the key-value pair.
 * @property {string} [type] - The type of the value.
 */
export interface KeyValuePairs {
  [key: string]: any;
}
