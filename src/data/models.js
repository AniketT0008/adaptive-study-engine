import { getTeachingSupport, getTextbookDefinition, getUnitOverview } from '../engine/teaching.js';

/**
 * Creates a new concept.
 * @param {Object} params - Concept parameters.
 * @param {string} params.id - Concept ID.
 * @param {string} params.label - Concept label.
 * @param {string} params.sourceSnippet - Source snippet.
 * @returns {Object} The concept object.
 */
export function createConcept({ id, label, sourceSnippet, example, unit, topics, learningGoal, commonMistake, intuition, workedExplanation }) {
  const generatedSupport = getTeachingSupport(label, sourceSnippet, example);
  const support = {
    intuition: intuition || generatedSupport.intuition,
    workedExplanation: workedExplanation || generatedSupport.workedExplanation,
  };
  const textbookDefinition = getTextbookDefinition({ label, unit, summary: sourceSnippet, example, support });
  return {
    id,
    label,
    sourceSnippet: textbookDefinition,
    shortDefinition: sourceSnippet,
    example: example || null,
    intuition: support.intuition,
    workedExplanation: support.workedExplanation,
    learningGoal: learningGoal || `Explain ${label} and apply it to a new problem with an appropriate check.`,
    commonMistake: commonMistake || `Applying ${label} without first checking the conditions and assumptions.`,
    unit: unit || null,
    topics: topics || [],
    topicDefinition: getTextbookDefinition({
      label,
      unit,
      summary: sourceSnippet,
      example,
      support,
      paragraphCount: 2,
    }),
    mastery: 0,           // 0 to 1
    easinessFactor: 2.5,  // SM-2 default
    interval: 1,          // days
    repetitions: 0,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    history: []           // array of { timestamp, correct, difficulty }
  };
}

/**
 * Creates a new question.
 * @param {Object} params - Question parameters.
 * @param {string} params.id - Question ID.
 * @param {string} params.conceptId - Concept ID.
 * @param {string} params.type - Question type ('mcq').
 * @param {string} params.difficulty - Question difficulty ('easy' | 'medium' | 'hard').
 * @param {string} params.prompt - Question prompt.
 * @param {string[]} params.options - Question options (for mcq).
 * @param {string} params.answer - Question answer.
 * @param {string} params.explanation - Question explanation.
 * @returns {Object} The question object.
 */
export function createQuestion({ id, conceptId, difficulty, prompt, options, answer, explanation, visual = false }) {
  const normalizedOptions = Array.isArray(options) ? options.slice(0, 4) : [];
  return {
    id,
    conceptId,
    type: 'mcq',
    difficulty,
    prompt,
    options: normalizedOptions,
    answer,
    explanation,
    visual,
    requiresSelfAssessment: false,
  };
}

/**
 * Creates a new deck.
 * @param {Object} params - Deck parameters.
 * @param {string} params.id - Deck ID.
 * @param {string} params.title - Deck title.
 * @param {Object[]} params.concepts - Deck concepts.
 * @param {Object[]} params.questions - Deck questions.
 * @returns {Object} The deck object.
 */
export function createDeck({ id, title, concepts, questions, description, emoji, university, courseCode, units, syllabusUrl }) {
  const normalizedUnits = units?.length
    ? units
    : Object.entries((concepts || []).reduce((groups, concept) => {
      const name = concept.unit || 'Imported Material';
      if (!groups[name]) groups[name] = [];
      groups[name].push(concept.label);
      return groups;
    }, {})).map(([name, topics]) => ({ name, topics }));

  return {
    id,
    title,
    description: description || null,
    emoji: emoji || '📚',
    university: university || null,
    courseCode: courseCode || null,
    units: normalizedUnits.map((unit) => ({
      ...unit,
      definition: unit.definition || getUnitOverview(unit.name, unit.topics || [], concepts),
    })),
    syllabusUrl: syllabusUrl || null,
    createdAt: new Date().toISOString(),
    concepts,
    questions,
    sessionLogs: [],   // array of { timestamp, questionId, conceptId, correct, difficulty }
    streak: 0,
    longestStreak: 0
  };
}
