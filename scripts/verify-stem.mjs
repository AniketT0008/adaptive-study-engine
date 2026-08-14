import { EXAMPLE_DECKS } from '../src/data/exampleDeck.js';
import { getTopicQuestions } from '../src/data/topicQuestions.js';
import { getQuestionSet, getTeachingSupport } from '../src/engine/teaching.js';

const targets = EXAMPLE_DECKS.filter((d) => /mcv4u|sph4u|sch4u/.test(d.id));
const missing = [];
const fallbackish = [];

for (const deck of targets) {
  for (const concept of deck.concepts) {
    const topic = getTopicQuestions(concept.label);
    if (!topic?.easy) missing.push(`${deck.id}: ${concept.label}`);
    const prompts = getQuestionSet(concept).map((q) => q.prompt).join(' | ');
    if (/worked claim|Which statement is the worked/i.test(prompts)) {
      fallbackish.push(concept.label);
    }
  }
}

console.log('decks', targets.map((d) => `${d.id} (${d.concepts.length})`).join(', '));
console.log('missing topicQuestions', missing.length);
if (missing.length) console.log(missing);
console.log('fallbackish prompts', fallbackish.length);
if (fallbackish.length) console.log(fallbackish);

const orbit = getTeachingSupport('Universal Gravitation and Orbits', 'orbital speed v=sqrt(GM/r)', 'v=sqrt(GM/r)');
console.log('orbit contaminated?', /electron orbitals|1s2/.test(`${orbit.intuition} ${orbit.workedExplanation}`));

const induction = getTeachingSupport('Electromagnetic Induction', "Faraday's law", 'flux');
console.log('induction contaminated?', /electrolytic|96 485|moles electrons/.test(`${induction.intuition} ${induction.workedExplanation}`));

const electro = getTeachingSupport("Electrolytic Cells and Faraday's Law", 'Q=It', 'Q=It');
console.log('electrolytic support present?', /electrolytic|Faraday/i.test(electro.intuition));
