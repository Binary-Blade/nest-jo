import { DEV_ENV, PROD_ENV } from '@utils/constants/constants.env';
import * as winston from 'winston';

/**
 * Define the log levels
 *
 * error: 0,
 * warn: 1,
 * info: 2,
 * http: 3,
 * debug: 4
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

/**
 * Determine the log level based on the environment
 *
 * @returns string - The log level
 * @default 'debug' if in development, 'warn' otherwise
 */
const level = () => {
  const env = process.env.NODE_ENV || DEV_ENV;
  const isDevelopment = env === DEV_ENV;
  return isDevelopment ? 'debug' : 'warn';
};

/**
 * Define the common format for logs
 *
 * @type {winston.Logform.Format}
 * @default timestamp, errors, splat
 * @see
 */
const commonFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Print stack trace
  winston.format.splat()
);

/**
 * Define the format for console logs
 *
 * @type {winston.Logform.Format}
 * @default colorize, printf
 * @see
 */
const consoleFormat: winston.Logform.Format = winston.format.combine(
  commonFormat,
  winston.format.colorize(), // Colorize part of the message
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Configure the Winston logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.combine(commonFormat, winston.format.json()) // Use JSON format for files
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.combine(commonFormat, winston.format.json()) // Consistent with error log format
    })
  ]
});

// If not in production, also log to the console with a simpler format
if (process.env.NODE_ENV !== PROD_ENV) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat
    })
  );
}
