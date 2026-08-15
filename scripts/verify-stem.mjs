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
const removedQuestionPatterns = [
  /what failed/i,
  /which audit/i,
  /which revision/i,
  /fails? in production/i,
  /different (?:answers|results)/i,
  /wrong physical conclusion/i,
  /locate a .*error/i,
  /which diagnosis/i,
  /diagnos(?:e|is)/i,
];
const errors = [];
const answerPositions = [0, 0, 0, 0];
const intuitionOwners = new Map();

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
      const removedQuestion = removedQuestionPatterns.find((pattern) => pattern.test(question.prompt));
      if (removedQuestion) errors.push(`${prefix}: removed diagnostic question matched ${removedQuestion}.`);
      const filler = fillerPatterns.find((pattern) => pattern.test(combined));
      if (filler) errors.push(`${prefix}: generic/filler language matched ${filler}.`);
      const answerIndex = question.options.findIndex((option) => option === question.answer);
      if (answerIndex >= 0) answerPositions[answerIndex] += 1;
    }

    for (const [field, minimum] of [
      ['shortDefinition', 45],
      ['intuition', 70],
      ['workedExplanation', 140],
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
    const normalizedExample = concept.example.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const normalizedWorked = concept.workedExplanation.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (normalizedExample === normalizedWorked) errors.push(`${prefix}: worked explanation only repeats the example.`);
    const definitionParagraphs = concept.sourceSnippet.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    if (definitionParagraphs.length < 3 || concept.sourceSnippet.length < 350) {
      errors.push(`${prefix}: textbook definition must contain at least three substantial paragraphs.`);
    }
    const normalizedIntuition = concept.intuition.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const owner = intuitionOwners.get(normalizedIntuition);
    if (owner && owner.label !== concept.label) {
      errors.push(`${prefix}: intuition duplicates the different lesson "${owner.label}" in ${owner.deck}.`);
    } else if (!owner) {
      intuitionOwners.set(normalizedIntuition, { deck: deck.id, label: concept.label });
    }
  }
}

const answerTotal = answerPositions.reduce((sum, count) => sum + count, 0);
answerPositions.forEach((count, index) => {
  if (count / answerTotal < 0.2) errors.push(`Correct answers are not balanced: position ${index + 1} has only ${count} of ${answerTotal}.`);
});

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const conceptCount = decks.reduce((sum, deck) => sum + deck.concepts.length, 0);
  const questionCount = decks.reduce((sum, deck) => sum + deck.questions.length, 0);
  console.log(`Content validation passed: ${decks.length} courses, ${conceptCount} lessons, ${questionCount} questions.`);
}
