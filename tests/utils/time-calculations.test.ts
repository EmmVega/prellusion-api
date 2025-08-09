import { describe, it, expect } from '@jest/globals';
import { 
  calculateBlockDuration,
  parseTimeToMinutes,
  formatMinutesToDuration,
  addTimeToTime
} from '../../utils/time-calculations.js';

describe('Time Calculation Utilities', () => {
  describe('calculateBlockDuration', () => {
    it('should calculate duration correctly for 1 shot', () => {
      const result = calculateBlockDuration(1);
      expect(result).toBe('0:15'); // 1 * 15 minutes = 15 minutes
    });

    it('should calculate duration correctly for 5 shots', () => {
      const result = calculateBlockDuration(5);
      expect(result).toBe('1:15'); // 5 * 15 minutes = 75 minutes = 1:15
    });

    it('should calculate duration correctly for 10 shots', () => {
      const result = calculateBlockDuration(10);
      expect(result).toBe('2:30'); // 10 * 15 minutes = 150 minutes = 2:30
    });

    it('should handle zero shots', () => {
      const result = calculateBlockDuration(0);
      expect(result).toBe('0:00'); // 0 * 15 minutes = 0 minutes
    });
  });

  describe('addTimeToTime', () => {
    it('should add times correctly', () => {
      const result = addTimeToTime('08:00:00', '1:15', '0:00');
      expect(result).toBe('09:15:00');
    });

    it('should add times with break time', () => {
      const result = addTimeToTime('08:00:00', '1:15', '0:30');
      expect(result).toBe('09:45:00');
    });

    it('should handle hour rollover', () => {
      const result = addTimeToTime('23:45:00', '0:30', '0:00');
      expect(result).toBe('24:15:00');
    });
  });

  describe('parseTimeToMinutes', () => {
    it('should parse HH:MM format correctly', () => {
      expect(parseTimeToMinutes('08:00')).toBe(480); // 8 * 60 = 480
      expect(parseTimeToMinutes('09:15')).toBe(555); // 9 * 60 + 15 = 555
      expect(parseTimeToMinutes('12:30')).toBe(750); // 12 * 60 + 30 = 750
    });

    it('should handle single digit hours', () => {
      expect(parseTimeToMinutes('8:00')).toBe(480);
      expect(parseTimeToMinutes('9:15')).toBe(555);
    });
  });

  describe('formatMinutesToDuration', () => {
    it('should format minutes to HH:MM correctly', () => {
      expect(formatMinutesToDuration(75)).toBe('1:15');
      expect(formatMinutesToDuration(150)).toBe('2:30');
      expect(formatMinutesToDuration(480)).toBe('8:00');
    });

    it('should handle zero minutes', () => {
      expect(formatMinutesToDuration(0)).toBe('0:00');
    });

    it('should handle minutes less than 60', () => {
      expect(formatMinutesToDuration(45)).toBe('0:45');
      expect(formatMinutesToDuration(15)).toBe('0:15');
    });
  });
});