const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const PLACEHOLDER_VALUES = new Set(['undefined', 'null', 'nan', '[object object]']);

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isUsableText(value) {
  const text = cleanText(value);
  return Boolean(text) && !PLACEHOLDER_VALUES.has(text.toLowerCase());
}

export function validateQuestion(question) {
  const errors = [];
  if (!question || typeof question !== 'object') return ['Question must be an object.'];
  if (!isUsableText(question.id)) errors.push('Question id is required.');
  if (!isUsableText(question.conceptId)) errors.push(`Question ${question.id || '(unknown)'} needs a conceptId.`);
  if (!isUsableText(question.prompt)) errors.push(`Question ${question.id || '(unknown)'} needs a prompt.`);
  if (question.type !== 'mcq') errors.push(`Question ${question.id || '(unknown)'} must use the mcq type.`);
  if (!VALID_DIFFICULTIES.has(question.difficulty)) errors.push(`Question ${question.id || '(unknown)'} has an invalid difficulty.`);
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`Question ${question.id || '(unknown)'} must have exactly four options.`);
    return errors;
  }

  const options = question.options.map(cleanText);
  if (options.some((option) => !isUsableText(option))) {
    errors.push(`Question ${question.id || '(unknown)'} contains an empty or placeholder option.`);
  }
  if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
    errors.push(`Question ${question.id || '(unknown)'} must have four unique options.`);
  }
  const answer = cleanText(question.answer);
  if (!isUsableText(answer) || !options.some((option) => option.toLowerCase() === answer.toLowerCase())) {
    errors.push(`Question ${question.id || '(unknown)'} answer must match one option.`);
  }
  if (!isUsableText(question.explanation)) {
    errors.push(`Question ${question.id || '(unknown)'} needs an explanation.`);
  }
  return errors;
}

export function validateDeck(deck) {
  const errors = [];
  if (!deck || typeof deck !== 'object') return ['Deck must be an object.'];
  if (!isUsableText(deck.id)) errors.push('Deck id is required.');
  if (!isUsableText(deck.title)) errors.push(`Deck ${deck.id || '(unknown)'} needs a title.`);
  if (!Array.isArray(deck.concepts) || deck.concepts.length === 0) errors.push(`Deck ${deck.id || '(unknown)'} needs at least one concept.`);
  if (!Array.isArray(deck.questions) || deck.questions.length === 0) errors.push(`Deck ${deck.id || '(unknown)'} needs at least one question.`);

  const conceptIds = new Set();
  for (const concept of deck.concepts || []) {
    if (!isUsableText(concept?.id) || !isUsableText(concept?.label)) {
      errors.push(`Deck ${deck.id || '(unknown)'} contains a concept without an id or label.`);
      continue;
    }
    if (conceptIds.has(concept.id)) errors.push(`Deck ${deck.id || '(unknown)'} has duplicate concept id ${concept.id}.`);
    if (concept.mastery !== undefined && (!Number.isFinite(concept.mastery) || concept.mastery < 0 || concept.mastery > 1)) {
      errors.push(`Concept ${concept.id} mastery must be between 0 and 1.`);
    }
    if (concept.history !== undefined && !Array.isArray(concept.history)) {
      errors.push(`Concept ${concept.id} history must be an array.`);
    }
    conceptIds.add(concept.id);
  }

  const questionIds = new Set();
  for (const question of deck.questions || []) {
    errors.push(...validateQuestion(question));
    if (questionIds.has(question?.id)) errors.push(`Deck ${deck.id || '(unknown)'} has duplicate question id ${question.id}.`);
    questionIds.add(question?.id);
    if (question?.conceptId && !conceptIds.has(question.conceptId)) {
      errors.push(`Question ${question.id || '(unknown)'} references a missing concept.`);
    }
  }
  return [...new Set(errors)];
}

export function normalizeDeck(deck) {
  if (!deck || typeof deck !== 'object') return null;
  const concepts = Array.isArray(deck.concepts)
    ? deck.concepts.filter((concept) => isUsableText(concept?.id) && isUsableText(concept?.label))
    : [];
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const questions = Array.isArray(deck.questions)
    ? deck.questions
      .map((question) => {
        if (!question || typeof question !== 'object') return null;
        const normalized = {
          ...question,
          id: cleanText(question.id),
          conceptId: cleanText(question.conceptId),
          prompt: cleanText(question.prompt),
          answer: cleanText(question.answer),
          explanation: cleanText(question.explanation),
          difficulty: VALID_DIFFICULTIES.has(question.difficulty) ? question.difficulty : 'medium',
          type: 'mcq',
          options: Array.isArray(question.options) ? question.options.map(cleanText) : [],
        };
        return validateQuestion(normalized).length === 0 && conceptIds.has(normalized.conceptId) ? normalized : null;
      })
      .filter(Boolean)
    : [];

  return {
    ...deck,
    id: cleanText(deck.id),
    title: cleanText(deck.title),
    concepts,
    questions,
  };
}

