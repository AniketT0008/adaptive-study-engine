function daysUntil(date) {
  const target = new Date(date).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.ceil((target - Date.now()) / 86400000);
}

function conceptPriority(concept) {
  const mastery = concept.mastery || 0;
  const reviewCount = concept.history?.length || 0;
  const days = daysUntil(concept.nextReviewDate);
  const overdueBoost = days <= 0 ? Math.min(0.35, Math.abs(days) * 0.04 + 0.16) : 0;
  const newBoost = reviewCount === 0 ? 0.18 : 0;
  const weakBoost = 1 - mastery;
  return Math.min(1, weakBoost * 0.62 + overdueBoost + newBoost);
}

function conceptReason(concept) {
  const mastery = Math.round((concept.mastery || 0) * 100);
  const days = daysUntil(concept.nextReviewDate);
  if (!concept.history?.length) return 'New lesson';
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (mastery < 45) return 'Low mastery';
  return 'Reinforce';
}

export function buildStudySprint(deck, minutes = 45) {
  const concepts = deck?.concepts || [];
  if (concepts.length === 0) {
    return {
      readiness: 0,
      headline: 'No lessons yet',
      minutes,
      reviewSlots: 0,
      learnSlots: 0,
      priorities: [],
      units: [],
      actions: [],
    };
  }

  const sorted = [...concepts]
    .map((concept) => ({
      ...concept,
      priority: conceptPriority(concept),
      reason: conceptReason(concept),
      due: daysUntil(concept.nextReviewDate) <= 0,
      newLesson: !concept.history?.length && !concept.learnedAt,
    }))
    .sort((a, b) => b.priority - a.priority);

  const practicedCount = sorted.filter((concept) => concept.history?.length).length;
  const dueCount = sorted.filter((concept) => concept.history?.length && concept.due).length;
  const weakCount = sorted.filter((concept) => concept.history?.length && (concept.mastery || 0) < 0.45).length;
  const avgMastery = practicedCount === 0
    ? 0
    : concepts.filter((concept) => concept.history?.length).reduce((sum, concept) => sum + (concept.mastery || 0), 0) / practicedCount;
  const readiness = practicedCount === 0
    ? 0
    : Math.max(0, Math.min(100, Math.round(avgMastery * 78 + (1 - weakCount / practicedCount) * 16 + (1 - dueCount / practicedCount) * 6)));
  const reviewSlots = Math.max(3, Math.min(sorted.length, Math.floor(minutes / 7)));
  const learnSlots = Math.max(1, Math.min(4, Math.floor(minutes / 18)));
  const priorities = sorted.slice(0, reviewSlots);
  const newLessons = sorted.filter((concept) => concept.newLesson).slice(0, learnSlots);
  const weakLessons = sorted.filter((concept) => !concept.newLesson && (concept.mastery || 0) < 0.55).slice(0, 4);

  const unitMap = new Map();
  for (const concept of concepts) {
    const unitName = concept.unit || 'Lessons';
    const existing = unitMap.get(unitName) || { name: unitName, total: 0, mastery: 0, due: 0, weak: 0 };
    existing.total += 1;
    existing.mastery += concept.mastery || 0;
    existing.due += concept.history?.length && daysUntil(concept.nextReviewDate) <= 0 ? 1 : 0;
    existing.weak += concept.history?.length && (concept.mastery || 0) < 0.45 ? 1 : 0;
    unitMap.set(unitName, existing);
  }

  const units = [...unitMap.values()]
    .map((unit) => ({
      ...unit,
      mastery: Math.round((unit.mastery / unit.total) * 100),
      risk: Math.min(100, Math.round((unit.weak / unit.total) * 70 + (unit.due / unit.total) * 30)),
    }))
    .sort((a, b) => b.risk - a.risk);

  const headline = practicedCount === 0
    ? 'Not started — learn then quiz'
    : readiness >= 80
      ? 'Exam-ready momentum'
      : readiness >= 60
        ? 'Solid base, targeted polish'
        : readiness >= 35
          ? 'Focus sprint recommended'
          : 'Build foundation first';

  const actions = [
    priorities.slice(0, 3).map((concept) => concept.label).join('; ') || 'No review lessons queued yet',
    newLessons.slice(0, 2).map((concept) => concept.label).join('; ') || 'No new lessons left to preview',
    weakLessons.slice(0, 2).map((concept) => concept.label).join('; ') || 'No weak lessons identified yet — quiz first',
  ];

  return {
    readiness,
    headline,
    minutes,
    reviewSlots,
    learnSlots,
    priorities,
    newLessons,
    weakLessons,
    units,
    actions,
  };
}
