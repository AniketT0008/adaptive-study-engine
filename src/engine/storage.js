import { EXAMPLE_DECKS } from '../data/exampleDeck.js';
import { UNIVERSITY_DECKS } from '../data/universityCatalog.js';
import { normalizeDeck, validateDeck } from '../data/validation.js';

const DECKS_KEY = 'adaptive-study-engine-decks';
const API_KEY_KEY = 'adaptive-study-engine-api-key';
const API_KEY_SESSION = 'adaptive-study-engine-api-key-session';
const STORAGE_VERSION = 2;

const ALL_BUILTIN_DECKS = [...EXAMPLE_DECKS, ...UNIVERSITY_DECKS];

function migrateBuiltInDeck(deck) {
  const builtIn = ALL_BUILTIN_DECKS.find((candidate) => candidate.id === deck?.id);
  if (!builtIn) return { deck, changed: false };

  const savedConceptCount = deck.concepts?.length || 0;
  const builtInConceptCount = builtIn.concepts?.length || 0;
  const isCurrent = deck.curriculumVersion === builtIn.curriculumVersion && savedConceptCount >= builtInConceptCount;
  if (isCurrent) return { deck, changed: false };

  const savedConceptsByLabel = new Map((deck.concepts || []).map((concept) => [concept.label, concept]));
  const migrated = {
    ...builtIn,
    createdAt: deck.createdAt || builtIn.createdAt,
    sessionLogs: deck.sessionLogs || [],
    streak: deck.streak || 0,
    longestStreak: deck.longestStreak || 0,
    questions: builtIn.questions,
    concepts: builtIn.concepts.map((concept) => {
      const savedConcept = savedConceptsByLabel.get(concept.label);
      return savedConcept
        ? {
          ...concept,
          ...savedConcept,
          unit: concept.unit,
          topics: concept.topics,
          sourceSnippet: concept.sourceSnippet,
          shortDefinition: concept.shortDefinition,
          topicDefinition: concept.topicDefinition,
          intuition: concept.intuition,
          workedExplanation: concept.workedExplanation,
          learningGoal: concept.learningGoal,
          commonMistake: concept.commonMistake,
          example: concept.example,
        }
        : concept;
    }),
  };

  return { deck: migrated, changed: true };
}

export function saveDecks(decks) {
  try {
    const normalized = (Array.isArray(decks) ? decks : [])
      .map(normalizeDeck)
      .filter(Boolean);
    localStorage.setItem(DECKS_KEY, JSON.stringify({ version: STORAGE_VERSION, decks: normalized }));
    return { ok: true, decks: normalized };
  } catch (e) {
    console.error('Failed to save decks:', e);
    return { ok: false, error: e };
  }
}

export function mergeDeckCollections(currentDecks, importedDecks) {
  const mergedById = new Map();
  for (const deck of currentDecks || []) {
    if (deck?.id) mergedById.set(deck.id, deck);
  }
  for (const deck of importedDecks || []) {
    if (deck?.id) mergedById.set(deck.id, deck);
  }
  return [...mergedById.values()];
}

export function loadDecks() {
  try {
    const data = localStorage.getItem(DECKS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    const storedDecks = Array.isArray(parsed) ? parsed : parsed?.decks;
    if (!Array.isArray(storedDecks)) return [];

    let changed = false;
    const migrated = storedDecks.map((deck) => {
      const result = migrateBuiltInDeck(deck);
      if (result.changed) changed = true;
      const normalized = normalizeDeck(result.deck);
      if (!normalized || validateDeck(normalized).length > 0) changed = true;
      return normalized;
    }).filter((deck) => deck && validateDeck(deck).length === 0);
    if (changed || Array.isArray(parsed) || parsed.version !== STORAGE_VERSION) saveDecks(migrated);
    return migrated;
  } catch (e) {
    console.error('Failed to load decks:', e);
    return [];
  }
}

export function saveDeck(deck) {
  const sourceErrors = validateDeck(deck);
  if (sourceErrors.length > 0) return { ok: false, errors: sourceErrors };
  const normalized = normalizeDeck(deck);
  const errors = validateDeck(normalized);
  if (!normalized || errors.length > 0) {
    return { ok: false, errors: errors.length ? errors : ['Deck could not be normalized.'] };
  }
  const decks = loadDecks();
  const idx = decks.findIndex(d => d.id === normalized.id);
  if (idx >= 0) decks[idx] = normalized;
  else decks.push(normalized);
  return saveDecks(decks);
}

export function getDeck(id) {
  const decks = loadDecks();
  const found = decks.find(d => d.id === id);
  if (found) return found;
  return ALL_BUILTIN_DECKS.find(d => d.id === id) || null;
}

export function deleteDeck(id) {
  const decks = loadDecks().filter(d => d.id !== id);
  saveDecks(decks);
}

export function saveApiKey(key, persist = false) {
  const trimmed = String(key || '').trim();
  try {
    if (trimmed) sessionStorage.setItem(API_KEY_SESSION, trimmed);
    else sessionStorage.removeItem(API_KEY_SESSION);
    if (persist && trimmed) localStorage.setItem(API_KEY_KEY, trimmed);
    else localStorage.removeItem(API_KEY_KEY);
  } catch (e) {
    console.error('Failed to save API key:', e);
  }
}

export function getApiKey() {
  try {
    return sessionStorage.getItem(API_KEY_SESSION) || localStorage.getItem(API_KEY_KEY) || '';
  } catch {
    return '';
  }
}

export function hasPersistedApiKey() {
  try {
    return Boolean(localStorage.getItem(API_KEY_KEY));
  } catch {
    return false;
  }
}
