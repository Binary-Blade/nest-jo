import { DEV_ENV, PROD_ENV } from '@utils/constants/constants.env';
import * as winston from 'winston';

/**
 * Logging levels for different types of messages.
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

/**
 * Determines the logging level based on the environment.
 *
 * @returns {string} - The logging level ('debug' for development, 'warn' for production).
 */
const level = (): string => {
  const env = process.env.NODE_ENV || DEV_ENV;
  const isDevelopment = env === DEV_ENV;
  return isDevelopment ? 'debug' : 'warn';
};

/**
 * Common format for all logs.
 */
const commonFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Print stack trace
  winston.format.splat()
);

/**
 * Console-specific log format.
 */
const consoleFormat: winston.Logform.Format = winston.format.combine(
  commonFormat,
  winston.format.colorize(), // Colorize part of the message
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

/**
 * Winston logger configuration.
 */
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

// Add console transport for non-production environments.
if (process.env.NODE_ENV !== PROD_ENV) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat
    })
  );
}
