/**
 * Creates a new concept.
 * @param {Object} params - Concept parameters.
 * @param {string} params.id - Concept ID.
 * @param {string} params.label - Concept label.
 * @param {string} params.sourceSnippet - Source snippet.
 * @returns {Object} The concept object.
 */
export function createConcept({ id, label, sourceSnippet }) {
  return {
    id,
    label,
    sourceSnippet,
    mastery: 0,           // 0 to 1
    easinessFactor: 2.5,  // SM-2 default
    interval: 1,          // days
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    history: []           // array of { timestamp, correct, difficulty }
  };
}

/**
 * Creates a new question.
 * @param {Object} params - Question parameters.
 * @param {string} params.id - Question ID.
 * @param {string} params.conceptId - Concept ID.
 * @param {string} params.type - Question type ('mcq' | 'short' | 'cloze').
 * @param {string} params.difficulty - Question difficulty ('easy' | 'medium' | 'hard').
 * @param {string} params.prompt - Question prompt.
 * @param {string[]} params.options - Question options (for mcq).
 * @param {string} params.answer - Question answer.
 * @param {string} params.explanation - Question explanation.
 * @returns {Object} The question object.
 */
export function createQuestion({ id, conceptId, type, difficulty, prompt, options, answer, explanation }) {
  // type: 'mcq' | 'short' | 'cloze'
  // difficulty: 'easy' | 'medium' | 'hard'
  // options: array of strings (for mcq only, null otherwise)
  return { id, conceptId, type, difficulty, prompt, options: options || null, answer, explanation };
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
export function createDeck({ id, title, concepts, questions }) {
  return {
    id,
    title,
    createdAt: new Date().toISOString(),
    concepts,
    questions,
    sessionLogs: [],   // array of { timestamp, questionId, conceptId, correct, difficulty }
    streak: 0,
    longestStreak: 0
  };
}
