import { Test, TestingModule } from '@nestjs/testing';
import { ConvertUtilsService } from './convert-utils.service';

describe('ConvertUtilsService', () => {
  let service: ConvertUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvertUtilsService]
    }).compile();

    service = module.get<ConvertUtilsService>(ConvertUtilsService);
  });

  describe('convertDaysToSeconds', () => {
    it('should convert days to seconds correctly', () => {
      expect(service.convertDaysToSeconds('1d')).toBe(86400);
      expect(service.convertDaysToSeconds('2d')).toBe(2 * 86400);
      expect(service.convertDaysToSeconds('0d')).toBe(0);
      expect(service.convertDaysToSeconds('10d')).toBe(10 * 86400);
    });

    it('should return 0 for invalid duration strings', () => {
      expect(service.convertDaysToSeconds('')).toBe(0);
      expect(service.convertDaysToSeconds('invalid')).toBe(0);
      expect(service.convertDaysToSeconds('d')).toBe(0);
    });
  });

  describe('convertDateStringToDate', () => {
    it('should convert date strings to Date objects correctly', () => {
      const date = service.convertDateStringToDate('2023-05-20');
      expect(date).toBeInstanceOf(Date);
      expect(date.getUTCFullYear()).toBe(2023);
      expect(date.getUTCMonth()).toBe(4); // Month is 0-based
      expect(date.getUTCDate()).toBe(20);
    });

    it('should handle invalid date strings', () => {
      const date = service.convertDateStringToDate('invalid-date');
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(true); // Invalid date
    });
  });
});
