import { describe, expect, it } from 'vitest';
import { buildStudySprint } from './studyPlan.js';

describe('study sprint planning', () => {
  it('keeps review, learn, and repair groups mutually exclusive', () => {
    const deck = {
      concepts: [
        { id: 'new', label: 'New', mastery: 0, history: [], nextReviewDate: '2099-01-01T00:00:00.000Z' },
        { id: 'due', label: 'Due', mastery: 0.2, history: [{ correct: false }], nextReviewDate: '2020-01-01T00:00:00.000Z' },
        { id: 'weak', label: 'Weak', mastery: 0.3, history: [{ correct: true }], nextReviewDate: '2099-01-01T00:00:00.000Z' },
        { id: 'steady', label: 'Steady', mastery: 0.7, history: [{ correct: true }], nextReviewDate: '2099-01-01T00:00:00.000Z' },
      ],
    };
    const sprint = buildStudySprint(deck, 25);
    const review = new Set(sprint.priorities.map((item) => item.id));
    const learn = new Set(sprint.newLessons.map((item) => item.id));
    const repair = new Set(sprint.weakLessons.map((item) => item.id));
    expect([...review].some((id) => learn.has(id) || repair.has(id))).toBe(false);
    expect([...learn].some((id) => repair.has(id))).toBe(false);
    expect(sprint.readinessScale).toContain('0–100');
  });

  it('does not claim readiness before practice', () => {
    const sprint = buildStudySprint({
      concepts: [{ id: 'new', label: 'New', mastery: 0, history: [], nextReviewDate: '2099-01-01T00:00:00.000Z' }],
    });
    expect(sprint.readiness).toBe(0);
    expect(sprint.headline).toMatch(/Not started/i);
  });
});

