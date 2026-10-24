import { describe, expect, it } from 'vitest';
import {
  TARGETS,
  calculatePercentageChange,
  formatCurrency,
  formatNumber,
  formatWeight,
  getProgressPercentage,
} from '@/lib/utils';

describe('formatNumber', () => {
  it('returns small numbers unchanged', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('abbreviates thousands with one decimal', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(12450)).toBe('12.4K'); // 12.45 is stored as 12.4499… in binary
    expect(formatNumber(12600)).toBe('12.6K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  it('abbreviates millions', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
  });
});

describe('formatCurrency', () => {
  it('formats whole dollars without decimals', () => {
    expect(formatCurrency(2847.5)).toBe('$2,848');
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatWeight', () => {
  it('uses kg below one tonne', () => {
    expect(formatWeight(43.6)).toBe('43.6 kg');
    expect(formatWeight(0)).toBe('0.0 kg');
  });

  it('switches to tonnes at 1000 kg', () => {
    expect(formatWeight(1000)).toBe('1.0 tonnes');
    expect(formatWeight(2500)).toBe('2.5 tonnes');
  });
});

describe('calculatePercentageChange', () => {
  it('computes normal growth', () => {
    expect(calculatePercentageChange(150, 100)).toBe(50);
    expect(calculatePercentageChange(50, 100)).toBe(-50);
  });

  it('handles division by zero', () => {
    expect(calculatePercentageChange(0, 0)).toBe(0);
    expect(calculatePercentageChange(10, 0)).toBe(100);
  });
});

describe('getProgressPercentage', () => {
  it('rounds and clamps at 100', () => {
    expect(getProgressPercentage(50, 100)).toBe(50);
    expect(getProgressPercentage(150, 100)).toBe(100);
    expect(getProgressPercentage(1, 3)).toBe(33);
  });
});

describe('TARGETS', () => {
  it('has a target for every dashboard metric', () => {
    expect(Object.keys(TARGETS)).toEqual(
      expect.arrayContaining([
        'capsCollected',
        'weightKg',
        'co2eAvoided',
        'revenue',
        'studentsEngaged',
        'productsMade',
      ])
    );
    for (const value of Object.values(TARGETS)) {
      expect(value).toBeGreaterThan(0);
    }
  });
});
