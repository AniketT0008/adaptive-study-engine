import { computeSM2, getQuality } from './sm2.js';

/**
 * Gets concepts that are due for review (nextReviewDate <= now).
 * Sorted by mastery ascending (weakest first).
 * If focusMode is true, only returns the bottom 25% mastery concepts.
 */
export function getDueConcepts(concepts, focusMode = false) {
  if (!concepts || !Array.isArray(concepts)) return [];
  
  const now = new Date().toISOString();
  let due = concepts.filter(c => c.nextReviewDate <= now);
  due.sort((a, b) => a.mastery - b.mastery);
  
  if (focusMode && concepts.length > 0) {
    const allSorted = [...concepts].sort((a, b) => a.mastery - b.mastery);
    const thresholdIndex = Math.max(0, Math.ceil(allSorted.length * 0.25) - 1);
    const threshold = allSorted[thresholdIndex]?.mastery ?? 0.25;
    
    // Filter due concepts to those at or below threshold
    let focusDue = due.filter(c => c.mastery <= threshold);
    if (focusDue.length === 0 && concepts.length > 0) {
      // Fallback: pick the lowest mastery concept regardless of due date
      focusDue = [allSorted[0]];
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
  
  let targetDifficulty;
  if (concept.mastery < 0.33) targetDifficulty = 'easy';
  else if (concept.mastery < 0.66) targetDifficulty = 'medium';
  else targetDifficulty = 'hard';
  
  // Try to find a question at the target difficulty, otherwise pick any
  const matched = conceptQs.filter(q => q.difficulty === targetDifficulty);
  if (matched.length > 0) return matched[Math.floor(Math.random() * matched.length)];
  return conceptQs[Math.floor(Math.random() * conceptQs.length)];
}

/**
 * Updates a concept after answering a question.
 * Adjusts mastery and computes SM-2.
 * Returns a new concept object (immutable update).
 */
export function updateConceptAfterAnswer(concept, isCorrect, difficulty) {
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
      difficulty
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
    return { targeted: Array(50).fill(0), random: Array(50).fill(0) };
  }

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
  
  return { targeted, random };
}
