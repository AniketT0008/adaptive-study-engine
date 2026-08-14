export function hasReviewHistory(concept) {
  return Array.isArray(concept?.history) && concept.history.length > 0;
}

export function isLearned(concept) {
  return Boolean(concept?.learnedAt) || hasReviewHistory(concept);
}

export function isDueForReview(concept, now = Date.now()) {
  if (!hasReviewHistory(concept)) return false;
  const dueAt = new Date(concept?.nextReviewDate || 0).getTime();
  return !Number.isFinite(dueAt) || dueAt <= now;
}

export function isMastered(concept) {
  return hasReviewHistory(concept) && (concept?.mastery || 0) >= 0.75;
}

export function getConceptState(concept, now = Date.now()) {
  if (isDueForReview(concept, now)) return 'due';
  if (isMastered(concept)) return 'mastered';
  if (hasReviewHistory(concept)) return 'reviewed';
  if (concept?.learnedAt) return 'learned';
  return 'new';
}

export function summarizeConcepts(concepts, now = Date.now()) {
  const list = Array.isArray(concepts) ? concepts : [];
  return list.reduce((summary, concept) => {
    summary.total += 1;
    const state = getConceptState(concept, now);
    summary[state] += 1;
    summary.reviews += concept?.history?.length || 0;
    summary.masteryTotal += concept?.mastery || 0;
    return summary;
  }, {
    total: 0,
    new: 0,
    learned: 0,
    reviewed: 0,
    due: 0,
    mastered: 0,
    reviews: 0,
    masteryTotal: 0,
  });
}

