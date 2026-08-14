import { describe, expect, it } from 'vitest';
import { assessSourceMaterial, extractConcepts, generateLocalDeckFromText } from './gemini.js';

const detailedNotes = [
  'Limits describe the value a function approaches near a chosen input, even when the function value is missing at that input.',
  'A two-sided limit exists only when the left-hand and right-hand limits agree, so both directions must be checked.',
  'For a rational expression that gives zero divided by zero, factoring may reveal a removable common factor and a finite limit.',
  'The simplified expression is valid near the point rather than at the cancelled point, which is sufficient for evaluating the limit.',
  'A graph can therefore have an open circle while still approaching one finite height from both sides.',
].join(' ');

describe('custom source quality', () => {
  it('rejects thin notes', () => {
    expect(assessSourceMaterial('Limits are useful.').ok).toBe(false);
    expect(() => generateLocalDeckFromText('Limits are useful.')).toThrow(/at least/i);
  });

  it('accepts detailed notes', () => {
    expect(assessSourceMaterial(detailedNotes).ok).toBe(true);
  });

  it('requires verified generation instead of silent generic fallback', async () => {
    await expect(extractConcepts(detailedNotes, '')).rejects.toThrow(/Connect Gemini/i);
  });
});

