import { EXAMPLE_DECKS } from '../src/data/exampleDeck.js';
import { UNIVERSITY_DECKS } from '../src/data/universityCatalog.js';
import { validateDeck } from '../src/data/validation.js';

const decks = [...EXAMPLE_DECKS, ...UNIVERSITY_DECKS];
const expectedDifficulties = ['easy', 'hard', 'medium'];
const fillerPatterns = [
  /worked claim/i,
  /which statement is the worked/i,
  /average (?:all|every) (?:the )?(?:givens|numbers)/i,
  /pick any familiar formula/i,
  /quote the name .* skip the givens/i,
  /round until it matches/i,
  /only a name to memorize/i,
];
const errors = [];

if (decks.length !== 16) errors.push(`Expected 16 built-in courses; found ${decks.length}.`);
if (EXAMPLE_DECKS.length !== 7) errors.push(`Expected 7 Ontario courses; found ${EXAMPLE_DECKS.length}.`);
if (UNIVERSITY_DECKS.length !== 9) errors.push(`Expected 9 university courses; found ${UNIVERSITY_DECKS.length}.`);

for (const deck of decks) {
  errors.push(...validateDeck(deck).map((error) => `${deck.id}: ${error}`));
  const promptSet = new Set();

  for (const concept of deck.concepts) {
    const prefix = `${deck.id} / ${concept.label}`;
    const questions = deck.questions.filter((question) => question.conceptId === concept.id);
    if (questions.length !== 3) errors.push(`${prefix}: expected exactly 3 questions; found ${questions.length}.`);
    const difficulties = questions.map((question) => question.difficulty).sort();
    if (JSON.stringify(difficulties) !== JSON.stringify(expectedDifficulties)) {
      errors.push(`${prefix}: expected one easy, medium, and hard question.`);
    }

    for (const question of questions) {
      const normalizedPrompt = question.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
      if (promptSet.has(normalizedPrompt)) errors.push(`${prefix}: duplicate prompt "${question.prompt}".`);
      promptSet.add(normalizedPrompt);
      if (question.prompt.length < 8) errors.push(`${prefix}: prompt is too short to be meaningful.`);
      if (question.explanation.length < 15) errors.push(`${prefix}: explanation is too short to explain the answer.`);
      const combined = `${question.prompt} ${question.options.join(' ')} ${question.explanation}`;
      const filler = fillerPatterns.find((pattern) => pattern.test(combined));
      if (filler) errors.push(`${prefix}: generic/filler language matched ${filler}.`);
    }

    for (const [field, minimum] of [
      ['shortDefinition', 45],
      ['intuition', 70],
      ['workedExplanation', 20],
      ['learningGoal', 45],
      ['commonMistake', 45],
    ]) {
      if (typeof concept[field] !== 'string' || concept[field].trim().length < minimum) {
        errors.push(`${prefix}: ${field} is missing or too thin.`);
      }
    }

    const lessonParts = [
      concept.shortDefinition,
      concept.intuition,
      concept.workedExplanation,
      concept.learningGoal,
      concept.commonMistake,
    ].map((part) => part.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
    if (new Set(lessonParts).size !== lessonParts.length) {
      errors.push(`${prefix}: lesson sections contain duplicated padding.`);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const conceptCount = decks.reduce((sum, deck) => sum + deck.concepts.length, 0);
  const questionCount = decks.reduce((sum, deck) => sum + deck.questions.length, 0);
  console.log(`Content validation passed: ${decks.length} courses, ${conceptCount} lessons, ${questionCount} questions.`);
}
