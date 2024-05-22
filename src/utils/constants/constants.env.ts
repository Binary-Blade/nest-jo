/**
 * Environment variable for the node environment.
 * @constant
 * @type {string}
 *
 * @example
 * const env = process.env[NODE_ENV];
 */
export const NODE_ENV: string = 'NODE_ENV';

/**
 * Value for the development environment.
 * @constant
 * @type {string}
 *
 * @example
 * if (process.env[NODE_ENV] === DEV_ENV) {
 *   // Development specific logic
 * }
 */
export const DEV_ENV: string = 'development';

/**
 * Value for the production environment.
 * @constant
 * @type {string}
 *
 * @example
 * if (process.env[NODE_ENV] === PROD_ENV) {
 *   // Production specific logic
 * }
 */
export const PROD_ENV: string = 'production';
