import { Injectable } from '@nestjs/common';

/**
 * Service to handle various utility conversions.
 * @class
 */
@Injectable()
export class ConvertUtilsService {
  /**
   * Converts a duration string in days to seconds.
   *
   * @param {string} duration - The duration string (e.g., '7d').
   * @returns {number} - The duration in seconds.
   *
   * @example
   * const seconds = convertUtilsService.convertDaysToSeconds('7d');
   */
  convertDaysToSeconds(duration: string): number {
    const days = parseInt(duration.replace('d', ''), 10);
    return isNaN(days) ? 0 : days * 86400;
  }

  /**
   * Converts a date string in 'YYYY-MM-DD' format to a Date object.
   *
   * @param {string} dateStr - The date string (e.g., '2023-05-22').
   * @returns {Date} - The converted Date object.
   *
   * @example
   * const date = convertUtilsService.convertDateStringToDate('2023-05-22');
   */
  convertDateStringToDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-');
    return new Date(Date.UTC(+year, +month - 1, +day));
  }
}
