import { computeSM2, getQuality } from './sm2.js';
import { hasReviewHistory, isDueForReview } from './selectors.js';

export const SESSION_NEW_CAP = 3;
export const SESSION_CAP = 8;

function sortByMasteryThenDue(a, b) {
  const masteryDifference = (a.mastery || 0) - (b.mastery || 0);
  if (masteryDifference !== 0) return masteryDifference;
  return new Date(a.nextReviewDate || 0) - new Date(b.nextReviewDate || 0);
}

/**
 * Gets concepts for a review session.
 * Due reviewed cards first, then up to 3 new cards, session capped at 8.
 * Focus mode uses only cards with real quiz history (weakest 25%).
 */
export function getDueConcepts(concepts, focusMode = false) {
  if (!concepts || !Array.isArray(concepts)) return [];

  const now = new Date().toISOString();

  if (focusMode) {
    const practiced = concepts.filter(hasReviewHistory).sort(sortByMasteryThenDue);
    if (practiced.length === 0) return [];
    const focusCount = Math.max(1, Math.ceil(practiced.length * 0.25));
    return practiced.slice(0, Math.min(focusCount, SESSION_CAP));
  }

  const dueReviewed = concepts
    .filter((concept) => hasReviewHistory(concept) && isDueForReview(concept, new Date(now).getTime()))
    .sort(sortByMasteryThenDue);
  const learnedUnquizzed = concepts.filter((concept) => !hasReviewHistory(concept) && concept.learnedAt);
  const brandNew = concepts.filter((concept) => !hasReviewHistory(concept) && !concept.learnedAt);
  const newToIntro = [...learnedUnquizzed, ...brandNew].slice(0, SESSION_NEW_CAP);

  return [...dueReviewed, ...newToIntro].slice(0, SESSION_CAP);
}

/** Cards with quiz history whose SM-2 date is due. Does not include brand-new lessons. */
export function getDueReviewedConcepts(concepts) {
  if (!concepts || !Array.isArray(concepts)) return [];
  const now = new Date().toISOString();
  return concepts.filter((concept) => hasReviewHistory(concept) && isDueForReview(concept, new Date(now).getTime()));
}

/**
 * Selects the best question for a concept based on current mastery.
 * Low mastery → easy question, medium → medium, high → hard.
 * Returns a question object, or null if none available.
 */
export function selectNextQuestion(questions, concept) {
  if (!questions || !Array.isArray(questions) || !concept) return null;

  const conceptQs = questions.filter(q => q.conceptId === concept.id);
  if (conceptQs.length === 0) return null;
  
  const recentAttempts = (concept.history || []).slice(-5);
  const recentAccuracy = recentAttempts.length
    ? recentAttempts.filter((attempt) => attempt.correct).length / recentAttempts.length
    : null;

  let targetDifficulty = 'medium';
  if ((concept.mastery || 0) < 0.33 || (recentAccuracy !== null && recentAccuracy < 0.5)) targetDifficulty = 'easy';
  else if ((concept.mastery || 0) >= 0.7 && recentAccuracy !== null && recentAccuracy >= 0.75) targetDifficulty = 'hard';

  const attemptByQuestion = new Map();
  for (const attempt of concept.history || []) {
    if (attempt.questionId) attemptByQuestion.set(attempt.questionId, attempt.timestamp || '');
  }

  const ladder = ['easy', 'medium', 'hard'];
  let chosenDifficulty = targetDifficulty;
  const unseenAt = (difficulty) => conceptQs.filter((question) => question.difficulty === difficulty && !attemptByQuestion.has(question.id));
  if (unseenAt(chosenDifficulty).length === 0) {
    const start = Math.max(0, ladder.indexOf(chosenDifficulty));
    for (let i = start + 1; i < ladder.length; i += 1) {
      if (unseenAt(ladder[i]).length > 0) {
        chosenDifficulty = ladder[i];
        break;
      }
    }
  }

  const targetPool = conceptQs.filter((question) => question.difficulty === chosenDifficulty);
  const pool = targetPool.length > 0 ? targetPool : conceptQs;

  // Prefer questions not seen in this concept's recent history, then the least recently seen.
  return [...pool].sort((a, b) => {
    const aSeen = attemptByQuestion.get(a.id);
    const bSeen = attemptByQuestion.get(b.id);
    if (!aSeen && bSeen) return -1;
    if (aSeen && !bSeen) return 1;
    return String(aSeen || '').localeCompare(String(bSeen || '')) || a.id.localeCompare(b.id);
  })[0] || null;
}

/**
 * Returns the next rung in a lesson's difficulty ladder after a correct answer.
 * It never repeats a question already in the current session queue.
 */
export function getFollowUpQuestion(questions, conceptId, currentQuestion, queuedQuestionIds, isCorrect) {
  if (!isCorrect || !currentQuestion || !Array.isArray(questions)) return null;

  const nextDifficulty = { easy: 'medium', medium: 'hard' }[currentQuestion.difficulty];
  if (!nextDifficulty) return null;

  const seen = queuedQuestionIds instanceof Set ? queuedQuestionIds : new Set(queuedQuestionIds || []);
  return questions.find((candidate) => (
    candidate.conceptId === conceptId
    && candidate.difficulty === nextDifficulty
    && !seen.has(candidate.id)
  )) || null;
}

/**
 * Updates a concept after answering a question.
 * Adjusts mastery and computes SM-2.
 * Returns a new concept object (immutable update).
 */
export function updateConceptAfterAnswer(concept, isCorrect, difficulty, questionId = null) {
  if (!concept) return null;

  let masteryDelta;
  if (isCorrect) {
    masteryDelta = difficulty === 'hard' ? 0.15 : difficulty === 'medium' ? 0.1 : 0.05;
  } else {
    masteryDelta = difficulty === 'easy' ? -0.2 : difficulty === 'medium' ? -0.15 : -0.1;
  }
  
  const newMastery = Math.max(0, Math.min(1, concept.mastery + masteryDelta));
  const quality = getQuality(isCorrect, difficulty);
  const sm2Result = computeSM2(concept, quality);
  
  return {
    ...concept,
    mastery: newMastery,
    ...sm2Result,
    history: [...(concept.history || []), {
      timestamp: new Date().toISOString(),
      correct: isCorrect,
      difficulty,
      questionId
    }]
  };
}

/**
 * Simulates targeted vs random review strategies.
 * Returns { targeted: number[], random: number[] } — arrays showing cumulative avg mastery after each review.
 * Runs a Monte Carlo simulation.
 */
function createSeededRandom(seed) {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function conceptSeed(concepts) {
  return concepts.reduce((seed, concept) => {
    const text = `${concept.id || concept.label || ''}:${Math.round((concept.mastery || 0) * 1000)}`;
    for (let i = 0; i < text.length; i += 1) seed = ((seed << 5) - seed + text.charCodeAt(i)) | 0;
    return seed;
  }, 2166136261);
}

export function simulateComparison(concepts, seed = null) {
  if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
    return { targeted: Array(50).fill(0), random: Array(50).fill(0), informative: false };
  }

  const startingMastery = concepts.map((c) => c.mastery || 0);
  const informative = startingMastery.some((mastery) => mastery > 0) && startingMastery.some((mastery) => Math.abs(mastery - startingMastery[0]) > 0.04);
  const randomValue = createSeededRandom(seed ?? conceptSeed(concepts));

  const numReviews = 50; // simulate 50 reviews
  const numTrials = 20;  // average over 20 trials for random
  
  // --- Targeted simulation (always review weakest concept) ---
  const targeted = [];
  let tMasteries = concepts.map(c => c.mastery || 0);
  
  for (let i = 0; i < numReviews; i++) {
    // Pick the concept with lowest mastery
    let minIdx = 0;
    for (let j = 1; j < tMasteries.length; j++) {
      if (tMasteries[j] < tMasteries[minIdx]) minIdx = j;
    }
    // Simulate answering: higher mastery = more likely correct
    const pCorrect = 0.3 + tMasteries[minIdx] * 0.5;
    const correct = randomValue() < pCorrect;
    tMasteries[minIdx] = Math.max(0, Math.min(1, tMasteries[minIdx] + (correct ? 0.12 : -0.05)));
    
    const avg = tMasteries.reduce((s, m) => s + m, 0) / tMasteries.length;
    targeted.push(Math.round(avg * 100) / 100);
  }
  
  // --- Random simulation (pick random concept) ---
  const randomResults = [];
  for (let t = 0; t < numTrials; t++) {
    let rMasteries = concepts.map(c => c.mastery || 0);
    const trial = [];
    for (let i = 0; i < numReviews; i++) {
      const idx = Math.floor(randomValue() * rMasteries.length);
      const pCorrect = 0.3 + rMasteries[idx] * 0.5;
      const correct = randomValue() < pCorrect;
      rMasteries[idx] = Math.max(0, Math.min(1, rMasteries[idx] + (correct ? 0.12 : -0.05)));
      const avg = rMasteries.reduce((s, m) => s + m, 0) / rMasteries.length;
      trial.push(avg);
    }
    randomResults.push(trial);
  }
  
  // Average across trials
  const random = [];
  for (let i = 0; i < numReviews; i++) {
    const avg = randomResults.reduce((s, trial) => s + trial[i], 0) / numTrials;
    random.push(Math.round(avg * 100) / 100);
  }
  
  return { targeted, random, informative };
}
