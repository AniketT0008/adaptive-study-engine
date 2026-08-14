import { describe, expect, it } from 'vitest';
import { EXAMPLE_DECKS } from './exampleDeck.js';
import { UNIVERSITY_DECKS } from './universityCatalog.js';
import { normalizeDeck, validateDeck, validateQuestion } from './validation.js';

describe('built-in content contracts', () => {
  it('validates every built-in deck', () => {
    const errors = [...EXAMPLE_DECKS, ...UNIVERSITY_DECKS].flatMap((deck) => validateDeck(deck));
    expect(errors).toEqual([]);
  });

  it('rejects malformed and placeholder options', () => {
    const question = {
      id: 'q1',
      conceptId: 'c1',
      type: 'mcq',
      difficulty: 'easy',
      prompt: 'A valid prompt?',
      options: ['yes', 'undefined', 'yes', ''],
      answer: 'yes',
      explanation: 'A useful explanation.',
    };
    expect(validateQuestion(question).length).toBeGreaterThan(0);
  });

  it('does not keep invalid questions during migration normalization', () => {
    const normalized = normalizeDeck({
      id: 'deck',
      title: 'Deck',
      concepts: [{ id: 'c1', label: 'Concept' }],
      questions: [{ id: 'q1', conceptId: 'c1', prompt: 'Bad', options: [], answer: '' }],
    });
    expect(normalized.questions).toEqual([]);
  });
});

