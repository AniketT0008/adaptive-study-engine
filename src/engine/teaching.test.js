import { describe, expect, it } from 'vitest';
import { EXAMPLE_DECKS } from '../data/exampleDeck.js';
import { UNIVERSITY_DECKS } from '../data/universityCatalog.js';
import { buildExampleSteps, buildWorkedWalkthrough, getQuestionSet } from './teaching.js';

describe('teaching content', () => {
  const concepts = [...EXAMPLE_DECKS, ...UNIVERSITY_DECKS].flatMap((deck) => deck.concepts);

  it('builds a concrete multi-step walkthrough for every example', () => {
    for (const concept of concepts) {
      const steps = buildExampleSteps(concept);
      expect(steps.length, concept.label).toBeGreaterThanOrEqual(5);
      expect(steps.some((step) => step.detail.includes(concept.example)), concept.label).toBe(true);
      expect(buildWorkedWalkthrough(concept), concept.label).toContain(concept.example);
    }
  });

  it('keeps three distinct, non-diagnostic practice variants per lesson', () => {
    for (const concept of concepts) {
      const questions = getQuestionSet(concept);
      expect(questions, concept.label).toHaveLength(3);
      expect(new Set(questions.map((question) => question.prompt)).size, concept.label).toBe(3);
      expect(questions.map((question) => question.prompt).join(' '), concept.label)
        .not.toMatch(/what failed|which diagnosis|which audit/i);
    }
  });
});
