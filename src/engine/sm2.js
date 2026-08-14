/**
 * Computes the next SM-2 state for a concept after a review.
 * @param {Object} concept - has easinessFactor, interval, repetitions
 * @param {number} quality - 0-5 rating
 * @returns {Object} { easinessFactor, interval, repetitions, nextReviewDate }
 */
export function computeSM2(concept, quality) {
  let { easinessFactor, interval, repetitions } = concept;

  if (quality < 3) {
    // Failed: reset
    repetitions = 0;
    interval = 1;
  } else {
    // Classic SM-2 schedules from the ease factor that was in effect for the
    // completed repetition, then updates that factor for the next repetition.
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  }

  easinessFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (easinessFactor < 1.3) easinessFactor = 1.3;

  const nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString();

  return { easinessFactor, interval, repetitions, nextReviewDate };
}

/**
 * Maps correctness + difficulty to a SM-2 quality rating (0-5).
 */
export function getQuality(isCorrect, difficulty) {
  if (!isCorrect) return 1;
  switch (difficulty) {
    case 'easy': return 5;
    case 'medium': return 4;
    case 'hard': return 3;
    default: return 4;
  }
}
