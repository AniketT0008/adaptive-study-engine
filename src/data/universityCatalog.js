import { createConcept, createDeck, createQuestion } from './models.js';
import { getQuestionSet, rotateOptions } from '../engine/teaching.js';
import { getLessonPack } from './lessonBank.js';

const COURSE_CATALOG = [
  {
    id: 'uw-ece150',
    university: 'University of Waterloo',
    courseCode: 'ECE 150',
    title: 'Fundamentals of Programming',
    emoji: '💻',
    description: 'Programming fundamentals for engineering students.',
    syllabusUrl: 'https://ece.uwaterloo.ca/~ece150/',
    units: [
      ['Program Design Foundations', ['Variables and primitive types', 'Expressions and operators', 'Input, output, and formatting', 'Tracing and dry-running code']],
      ['Control Flow', ['Boolean logic and conditionals', 'Loops and iteration patterns', 'Nested loops', 'Error handling and defensive checks']],
      ['Functions and Decomposition', ['Function signatures and return values', 'Parameter passing', 'Scope and lifetime', 'Modular decomposition']],
      ['Data Collections', ['Arrays and lists', 'Traversal and aggregation', 'Searching collections', 'Sorting fundamentals']],
      ['Memory and Abstraction', ['References and aliases', 'Pointers or object references', 'Classes and encapsulation', 'Testing and debugging workflow']],
    ],
  },
  {
    id: 'uw-cs135',
    university: 'University of Waterloo',
    courseCode: 'CS 135',
    title: 'Designing Functional Programs',
    emoji: '🧮',
    description: 'Functional program design using Racket/Scheme.',
    syllabusUrl: 'https://student.cs.uwaterloo.ca/~cs135/',
    units: [
      ['Design Recipe', ['Contracts, purpose, and examples', 'Tests and expected values', 'Templates from data definitions', 'Helper functions and composition']],
      ['Functional Core', ['Expressions and evaluation', 'Conditionals and predicates', 'Local bindings', 'Symbolic and numeric data']],
      ['Recursive Data', ['Structural recursion on lists', 'Recursion on natural numbers', 'Trees and nested data', 'Accumulator-style reasoning']],
      ['Abstraction', ['Higher-order functions', 'Map, filter, and fold patterns', 'Lambda expressions', 'Function-producing functions']],
      ['Generative and Graph Search Ideas', ['Backtracking search', 'Graphs and reachability', 'Termination arguments', 'Complexity intuition']],
    ],
  },
  {
    id: 'laurier-cp104',
    university: 'Wilfrid Laurier University',
    courseCode: 'CP104',
    title: 'Introduction to Programming',
    emoji: '⌨️',
    description: 'Structured program design and implementation.',
    units: [
      ['Programming Basics', ['Variables and assignment', 'Expressions and type conversion', 'Console input/output', 'Simple program tracing']],
      ['Control Structures', ['If/elif/else decisions', 'Boolean operators', 'While loops', 'For loops and ranges']],
      ['Functions and Files', ['Function design', 'Parameters and return values', 'Text file reading', 'CSV-style data processing']],
      ['Collections', ['Lists and indexing', 'List methods and slicing', 'Dictionaries and key lookup', 'Nested collections']],
      ['Software Practice', ['Testing strategies', 'Debugging techniques', 'Code style and documentation', 'Project decomposition']],
    ],
  },
  {
    id: 'laurier-geng131',
    university: 'Wilfrid Laurier University',
    courseCode: 'GENG131',
    title: 'Programming Principles',
    emoji: '🔧',
    description: 'Programming fundamentals with HCI and introductory AI concepts.',
    units: [
      ['Programming Foundations', ['Primitive data types', 'Conditionals', 'Loops', 'Functions']],
      ['Data and Algorithms', ['Arrays and structures', 'Searching', 'Sorting', 'Libraries and APIs']],
      ['Engineering Software Design', ['Requirements and constraints', 'Testing and validation', 'Modular design', 'Documentation']],
      ['Human-Computer Interaction', ['Usability heuristics', 'Interface feedback', 'Accessibility basics', 'User testing']],
      ['AI Foundations', ['Rule-based reasoning', 'Classification concepts', 'Training data and bias', 'Human oversight']],
    ],
  },
  {
    id: 'uoft-aer210',
    university: 'University of Toronto',
    courseCode: 'AER210H1',
    title: 'Vector Calculus & Fluid Mechanics',
    emoji: '🌊',
    description: 'Vector calculus applied to fluid mechanics.',
    units: [
      ['Multivariable Calculus', ['Partial derivatives', 'Gradient and directional derivative', 'Multiple integrals', 'Jacobians and coordinate transforms']],
      ['Vector Integral Theorems', ['Line integrals', 'Surface integrals', 'Green theorem', 'Divergence and Stokes theorems']],
      ['Fluid Kinematics', ['Continuum assumption', 'Velocity fields', 'Streamlines and pathlines', 'Material derivative']],
      ['Conservation Laws', ['Conservation of mass', 'Momentum balance', 'Hydrostatics', 'Bernoulli equation']],
      ['Viscous and Incompressible Flow', ['Viscosity and shear stress', 'Laminar flow', 'Boundary conditions', 'Dimensional analysis']],
    ],
  },
  {
    id: 'uoft-aer301',
    university: 'University of Toronto',
    courseCode: 'AER301H1',
    title: 'Dynamics',
    emoji: '🛰️',
    description: 'Particle, system, and rigid-body dynamics.',
    units: [
      ['Kinematics in Reference Frames', ['Relative motion', 'Rotating frames', 'Coriolis terms', 'Coordinate choices']],
      ['Particle and System Dynamics', ['Newton-Euler equations', 'Work and energy', 'Impulse and momentum', 'Central-force motion']],
      ['Analytical Mechanics', ['Generalized coordinates', 'Lagrange equations', 'D\'Alembert principle', 'Hamiltonian formulation']],
      ['Orbital Dynamics', ['Two-body problem', 'Orbital elements', 'Energy of orbits', 'Transfer maneuvers']],
      ['Rigid Bodies and Vibrations', ['Angular momentum', 'Euler equations', 'Small oscillations', 'Single-degree vibrations']],
    ],
  },
  {
    id: 'uoft-aer372',
    university: 'University of Toronto',
    courseCode: 'AER372H1',
    title: 'Control Systems',
    emoji: '🎛️',
    description: 'Classical and modern control theory.',
    units: [
      ['System Modelling', ['Differential equation models', 'Transfer functions', 'Block diagrams', 'Linearization']],
      ['Time and Frequency Response', ['Step response', 'Transient specifications', 'Bode plots', 'Frequency-domain interpretation']],
      ['Stability', ['Characteristic equations', 'Routh-Hurwitz criterion', 'Root locus', 'Nyquist stability']],
      ['Controller Design', ['PID control', 'Lead-lag compensation', 'Steady-state error', 'Robustness tradeoffs']],
      ['State Space and Digital Control', ['State-space models', 'Controllability and observability', 'Pole placement', 'Sampling and discretization']],
    ],
  },
  {
    id: 'uoft-mat307',
    university: 'University of Toronto',
    courseCode: 'MAT307H5',
    title: 'Curves and Surfaces',
    emoji: '📐',
    description: 'Differential geometry of curves and surfaces.',
    units: [
      ['Curves in Space', ['Parametrized curves', 'Arc length', 'Curvature', 'Torsion and Frenet frames']],
      ['Surface Geometry', ['Parametrized surfaces', 'Tangent planes', 'First fundamental form', 'Area element']],
      ['Curvature of Surfaces', ['Normal curvature', 'Gaussian curvature', 'Mean curvature', 'Shape operator']],
      ['Geodesics and Transport', ['Covariant derivative', 'Parallel transport', 'Geodesic equations', 'Geodesic curvature']],
      ['Global Results', ['Gauss map', 'Theorema egregium', 'Gauss-Bonnet theorem', 'Applications to topology']],
    ],
  },
  {
    id: 'uoft-act350',
    university: 'University of Toronto',
    courseCode: 'ACT350H1',
    title: 'Applied Probability for Actuarial Science',
    emoji: '📊',
    description: 'Stochastic processes for actuarial applications.',
    units: [
      ['Probability Foundations', ['Conditional probability', 'Conditional expectation', 'Transforms and generating functions', 'Common actuarial distributions']],
      ['Markov Chains', ['Transition matrices', 'Classification of states', 'Stationary distributions', 'Absorbing chains']],
      ['Poisson Processes', ['Counting processes', 'Exponential waiting times', 'Thinning and superposition', 'Non-homogeneous processes']],
      ['Renewal Theory', ['Renewal reward processes', 'Stopping times', 'Long-run averages', 'Applications to claims']],
      ['Queueing and Risk Models', ['Birth-death processes', 'M/M/1 queues', 'Ruin probability intuition', 'Simulation for actuarial systems']],
    ],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function lessonSnippet(course, unitName, lesson) {
  const code = course.courseCode.toLowerCase();
  if (/ece|cs|cp|geng/.test(code)) {
    return `${lesson} turns a program requirement into a precise, testable design decision. Explain the rule in your own words, trace it on a normal case and a boundary case, then justify how the code preserves the intended behaviour.`;
  }
  if (/aer210/.test(code)) {
    return `${lesson} connects multivariable calculus to fluid motion. Name the field or control volume, state the sign convention and assumptions, then interpret the mathematical result as a physical rate, force, or flow behaviour.`;
  }
  if (/aer301/.test(code)) {
    return `${lesson} models motion by choosing a reference frame and applying a conservation law or governing equation. A complete solution defines coordinates first, keeps vector directions consistent, and checks the result against limiting physical cases.`;
  }
  if (/aer372/.test(code)) {
    return `${lesson} explains how a dynamic system responds and how feedback changes that response. Move deliberately between the model, poles or frequency behaviour, and the engineering trade-off among stability, speed, accuracy, and robustness.`;
  }
  if (/mat307/.test(code)) {
    return `${lesson} describes geometry using a parametrization, its derivatives, and quantities that remain meaningful under a change of coordinates. Work symbolically first, state domain restrictions, then connect the calculation to curvature or shape.`;
  }
  if (/act/.test(code)) {
    return `${lesson} uses probability models to describe uncertainty over time. Define the random variables and conditioning information, verify the model assumptions, compute the requested quantity, and interpret it in terms of risk or long-run behaviour.`;
  }
  return `${lesson} is a core idea in ${unitName}. A rigorous solution defines the model and assumptions before calculating, explains why the selected method fits, and finishes with a check on units, signs, or boundary behaviour.`;
}

function lessonExample(courseCode, unitName, lesson) {
  const code = courseCode.toLowerCase();
  if (/ece|cs|cp|geng/.test(code)) {
    return `Practice workflow for ${lesson}:\n1. Write one sentence describing the input, output, and rule the program must preserve.\n2. Trace a normal case such as a three-item collection and a boundary case such as an empty collection.\n3. Choose the smallest data structure and control flow that makes the rule explicit.\n4. State one test that would expose a common implementation mistake.`;
  }
  if (/act/.test(code)) {
    return `Practice workflow for ${lesson}:\n1. Define the random variable or stochastic process and what one outcome represents.\n2. Write the distribution, transition rule, or conditioning event with its assumptions.\n3. Compute the probability, expectation, or long-run quantity symbolically before evaluating it.\n4. Interpret whether the result represents frequency, severity, waiting time, or financial risk.`;
  }
  if (/mat/.test(code)) {
    return `Practice workflow for ${lesson}:\n1. Write a parametrization or local coordinate description and state its domain.\n2. Differentiate to obtain tangent, normal, metric, or curvature data.\n3. Simplify symbolically and check that the expression is valid under a coordinate change.\n4. Explain the geometric meaning: bending, distance, angle, or intrinsic curvature.`;
  }
  if (/aer372/.test(code)) {
    return `Practice workflow for ${lesson}:\n1. State the input, output, operating point, and the performance requirement.\n2. Build or simplify the transfer-function or state-space model.\n3. Use poles, a response plot, or a stability criterion to make a prediction.\n4. Explain the trade-off and check whether the controller still meets the requirement.`;
  }
  return `Practice workflow for ${lesson}:\n1. Draw the system, choose coordinates, and label every known quantity and direction.\n2. State the governing equation and the assumptions that make it valid.\n3. Rearrange symbolically before substituting values.\n4. Check units, signs, and a simple limiting case before interpreting the result.`;
}

function packSourceSnippet(pack, course, unitName, lesson) {
  if (!pack) return lessonSnippet(course, unitName, lesson);
  return [
    pack.snippet,
    `${pack.intuition} ${pack.worked}`,
    `Worked example: ${pack.example} Goal: ${pack.goal} Common error: ${pack.mistake}`,
  ].join('\n\n');
}

function createCatalogConcept(course, unitName, lesson, unitIndex, lessonIndex) {
  const pack = getLessonPack(lesson);
  return createConcept({
    id: `${course.id}-u${unitIndex + 1}-l${lessonIndex + 1}-${slugify(lesson)}`,
    label: lesson,
    unit: unitName,
    topics: [unitName, lesson],
    sourceSnippet: packSourceSnippet(pack, course, unitName, lesson),
    example: pack?.example || lessonExample(course.courseCode, unitName, lesson),
    intuition: pack?.intuition,
    workedExplanation: pack?.worked,
    learningGoal: pack?.goal,
    commonMistake: pack?.mistake,
  });
}

function createCatalogQuestions(concept) {
  return getQuestionSet(concept).map((spec) => (
    createQuestion({
      id: `q-${concept.id}-${spec.difficulty}`,
      conceptId: concept.id,
      difficulty: spec.difficulty,
      prompt: spec.prompt,
      options: rotateOptions(spec.answer, spec.distractors, `${concept.id}-${spec.difficulty}`),
      answer: spec.answer,
      explanation: spec.explanation,
      visual: spec.visual,
    })
  ));
}

/** Build a full study deck from a catalog course entry. */
export function buildDeckFromCatalogCourse(course) {
  const concepts = course.units.flatMap(([unitName, lessons], unitIndex) =>
    lessons.map((lesson, lessonIndex) => createCatalogConcept(course, unitName, lesson, unitIndex, lessonIndex))
  );

  return {
    ...createDeck({
    id: course.id,
    title: `${course.courseCode} - ${course.title}`,
    description: `${course.university} - ${course.description}`,
    emoji: course.emoji,
    university: course.university,
    courseCode: course.courseCode,
    units: course.units.map(([name, lessons]) => ({ name, topics: lessons })),
    syllabusUrl: course.syllabusUrl || null,
    concepts,
    questions: concepts.flatMap(createCatalogQuestions),
    }),
    curriculumVersion: 12,
  };
}

export const UNIVERSITY_CATALOG = COURSE_CATALOG.map((course) => ({
  ...course,
  topics: course.units.flatMap(([, lessons]) => lessons),
}));

export const UNIVERSITY_DECKS = COURSE_CATALOG.map(buildDeckFromCatalogCourse);

export function getUniversityDecksBySchool() {
  const grouped = {};
  for (const course of UNIVERSITY_CATALOG) {
    if (!grouped[course.university]) grouped[course.university] = [];
    grouped[course.university].push(course);
  }
  return grouped;
}
