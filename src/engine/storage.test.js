import { describe, expect, it } from 'vitest';
import { getApiKey, hasPersistedApiKey, loadDecks, saveApiKey, saveDeck } from './storage.js';

const validDeck = {
  id: 'custom',
  title: 'Custom',
  concepts: [{
    id: 'c1',
    label: 'Concept',
    mastery: 0.4,
    history: [{ correct: true, timestamp: '2026-01-01T00:00:00.000Z' }],
  }],
  questions: [{
    id: 'q1',
    conceptId: 'c1',
    type: 'mcq',
    difficulty: 'easy',
    prompt: 'Which option is correct?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    explanation: 'A is correct for this fixture.',
  }],
};

describe('storage safety', () => {
  it('migrates legacy arrays without losing progress', () => {
    localStorage.setItem('adaptive-study-engine-decks', JSON.stringify([validDeck]));
    const decks = loadDecks();
    expect(decks[0].concepts[0].history).toHaveLength(1);
    const stored = JSON.parse(localStorage.getItem('adaptive-study-engine-decks'));
    expect(stored.version).toBe(2);
  });

  it('rejects malformed decks before saving', () => {
    const result = saveDeck({ ...validDeck, questions: [{ ...validDeck.questions[0], options: ['A'] }] });
    expect(result.ok).toBe(false);
    expect(loadDecks()).toEqual([]);
  });

  it('keeps API keys in the tab unless persistence is explicit', () => {
    saveApiKey('secret', false);
    expect(getApiKey()).toBe('secret');
    expect(sessionStorage.getItem('adaptive-study-engine-api-key-session')).toBe('secret');
    expect(hasPersistedApiKey()).toBe(false);

    saveApiKey('remembered', true);
    expect(hasPersistedApiKey()).toBe(true);
    expect(localStorage.getItem('adaptive-study-engine-api-key')).toBe('remembered');
  });
});

