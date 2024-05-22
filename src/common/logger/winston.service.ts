import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from './winston.config'; // Import your winston logger setup

/**
 * Service to handle logging using Winston.
 * @class
 * @implements {LoggerService}
 */
@Injectable()
export class WinstonLoggerService implements LoggerService {
  /**
   * Logs a message at the info level.
   *
   * @param {string} message - The message to log.
   *
   * @example
   * winstonLoggerService.log('This is an info message');
   */
  log(message: string) {
    logger.info(message);
  }

  /**
   * Logs a message at the error level.
   *
   * @param {string} message - The message to log.
   * @param {string} trace - The stack trace.
   *
   * @example
   * winstonLoggerService.error('This is an error message', 'Error stack trace');
   */
  error(message: string, trace: string) {
    logger.error(message, { trace });
  }

  /**
   * Logs a message at the warn level.
   *
   * @param {string} message - The message to log.
   *
   * @example
   * winstonLoggerService.warn('This is a warning message');
   */
  warn(message: string) {
    logger.warn(message);
  }

  /**
   * Logs a message at the debug level.
   *
   * @param {string} message - The message to log.
   *
   * @example
   * winstonLoggerService.debug('This is a debug message');
   */
  debug(message: string) {
    logger.debug(message);
  }

  /**
   * Logs a message at the verbose level.
   *
   * @param {string} message - The message to log.
   *
   * @example
   * winstonLoggerService.verbose('This is a verbose message');
   */
  verbose(message: string) {
    logger.verbose(message);
  }
}
