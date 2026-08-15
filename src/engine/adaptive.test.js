import { describe, expect, it } from 'vitest';
import { getDueConcepts, getDueReviewedConcepts, simulateComparison } from './adaptive.js';
import { getConceptState, summarizeConcepts } from './selectors.js';

const now = Date.now();
const concept = (overrides = {}) => ({
  id: `c-${Math.random()}`,
  label: 'Concept',
  mastery: 0,
  history: [],
  nextReviewDate: new Date(now + 86400000).toISOString(),
  ...overrides,
});

describe('adaptive concept selection', () => {
  it('does not count brand-new cards as due reviews', () => {
    const fresh = concept({ nextReviewDate: new Date(now - 86400000).toISOString() });
    const due = concept({
      id: 'due',
      history: [{ correct: true }],
      nextReviewDate: new Date(now - 1000).toISOString(),
    });
    expect(getDueReviewedConcepts([fresh, due])).toEqual([due]);
    expect(getConceptState(fresh, now)).toBe('new');
  });

  it('introduces only the configured number of new lessons', () => {
    const fresh = Array.from({ length: 11 }, (_, index) => concept({ id: `new-${index}` }));
    expect(getDueConcepts(fresh)).toHaveLength(8);
  });

  it('summarizes states using one shared definition', () => {
    const summary = summarizeConcepts([
      concept({ id: 'new' }),
      concept({ id: 'learned', learnedAt: new Date().toISOString() }),
      concept({ id: 'due', history: [{ correct: false }], nextReviewDate: new Date(now - 1000).toISOString() }),
      concept({ id: 'mastered', mastery: 0.9, history: [{ correct: true }], nextReviewDate: new Date(now + 86400000).toISOString() }),
    ], now);
    expect(summary).toMatchObject({ total: 4, new: 1, learned: 1, due: 1, mastered: 1, reviews: 2 });
  });

  it('produces deterministic comparison data', () => {
    const concepts = [concept({ id: 'a', mastery: 0.2 }), concept({ id: 'b', mastery: 0.8 })];
    expect(simulateComparison(concepts)).toEqual(simulateComparison(concepts));
  });
});
