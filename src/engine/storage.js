const DECKS_KEY = 'adaptive-study-engine-decks';
const API_KEY_KEY = 'adaptive-study-engine-api-key';

export function saveDecks(decks) {
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  } catch (e) {
    console.error('Failed to save decks:', e);
  }
}

export function loadDecks() {
  try {
    const data = localStorage.getItem(DECKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load decks:', e);
    return [];
  }
}

export function saveDeck(deck) {
  const decks = loadDecks();
  const idx = decks.findIndex(d => d.id === deck.id);
  if (idx >= 0) decks[idx] = deck;
  else decks.push(deck);
  saveDecks(decks);
}

export function getDeck(id) {
  const decks = loadDecks();
  return decks.find(d => d.id === id) || null;
}

export function deleteDeck(id) {
  const decks = loadDecks().filter(d => d.id !== id);
  saveDecks(decks);
}

export function saveApiKey(key) {
  try {
    localStorage.setItem(API_KEY_KEY, key);
  } catch (e) {
    console.error('Failed to save API key:', e);
  }
}

export function getApiKey() {
  try {
    return localStorage.getItem(API_KEY_KEY) || '';
  } catch (e) {
    return '';
  }
}
