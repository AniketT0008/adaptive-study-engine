import { computeSM2, getQuality } from './sm2.js';

/**
 * Gets concepts that are due for review (nextReviewDate <= now).
 * Sorted by mastery ascending (weakest first).
 * If focusMode is true, only returns the bottom 25% mastery concepts.
 */
export function getDueConcepts(concepts, focusMode = false) {
  if (!concepts || !Array.isArray(concepts)) return [];
  
  const now = new Date().toISOString();
  let due = concepts.filter((concept) => !concept.nextReviewDate || concept.nextReviewDate <= now);
  due.sort((a, b) => {
    const masteryDifference = (a.mastery || 0) - (b.mastery || 0);
    if (masteryDifference !== 0) return masteryDifference;
    return new Date(a.nextReviewDate || 0) - new Date(b.nextReviewDate || 0);
  });
  
  if (focusMode && concepts.length > 0) {
    const allSorted = [...concepts].sort((a, b) => {
      const masteryDifference = (a.mastery || 0) - (b.mastery || 0);
      if (masteryDifference !== 0) return masteryDifference;
      const historyDifference = (a.history?.length || 0) - (b.history?.length || 0);
      if (historyDifference !== 0) return historyDifference;
      return String(a.id).localeCompare(String(b.id));
    });
    const focusCount = Math.max(1, Math.ceil(allSorted.length * 0.25));
    const focusIds = new Set(allSorted.slice(0, focusCount).map((concept) => concept.id));
    let focusDue = due.filter((concept) => focusIds.has(concept.id));
    if (focusDue.length === 0) {
      focusDue = allSorted.slice(0, focusCount);
    }
    due = focusDue;
  }
  
  return due;
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

  const targetPool = conceptQs.filter((question) => question.difficulty === targetDifficulty);
  const pool = targetPool.length > 0 ? targetPool : conceptQs;
  const attemptByQuestion = new Map();
  for (const attempt of concept.history || []) {
    if (attempt.questionId) attemptByQuestion.set(attempt.questionId, attempt.timestamp || '');
  }

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
export function simulateComparison(concepts) {
  if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
    return { targeted: Array(50).fill(0), random: Array(50).fill(0), informative: false };
  }

  const startingMastery = concepts.map((c) => c.mastery || 0);
  const informative = startingMastery.some((mastery) => mastery > 0) && startingMastery.some((mastery, index) => Math.abs(mastery - startingMastery[0]) > 0.04);

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
    const correct = Math.random() < pCorrect;
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
      const idx = Math.floor(Math.random() * rMasteries.length);
      const pCorrect = 0.3 + rMasteries[idx] * 0.5;
      const correct = Math.random() < pCorrect;
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
