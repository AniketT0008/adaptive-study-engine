import { describe, expect, it, vi } from 'vitest';
import { computeSM2 } from './sm2.js';

describe('computeSM2', () => {
  it('uses the existing ease factor for the next interval before updating ease', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const result = computeSM2({
      easinessFactor: 2.5,
      interval: 6,
      repetitions: 2,
    }, 5);

    expect(result.interval).toBe(15);
    expect(result.easinessFactor).toBeCloseTo(2.6);
    expect(result.repetitions).toBe(3);
    expect(result.nextReviewDate).toBe('2026-01-16T00:00:00.000Z');
    vi.useRealTimers();
  });

  it('resets the interval and repetitions after an unsuccessful recall', () => {
    const result = computeSM2({
      easinessFactor: 2.5,
      interval: 15,
      repetitions: 3,
    }, 1);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easinessFactor).toBeCloseTo(1.96);
  });
});
