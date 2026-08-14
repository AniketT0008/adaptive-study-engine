export const DIAGRAM_LABELS = Object.freeze({
  'average-rate': 'Average rate uses a secant through two points.',
  discontinuity: 'A removable discontinuity is a hole where the two-sided limit exists.',
  derivative: 'The tangent line represents instantaneous rate at one point.',
  vectors: 'Vector arrows show direction and magnitude in a coordinate plane.',
  'periodic-trends': 'Across a period, increasing effective nuclear charge generally decreases atomic radius.',
  galvanic: 'In a galvanic cell, electrons flow through the external circuit from the oxidation anode to the reduction cathode.',
  esterification: 'Esterification combines a carboxylic acid and an alcohol to form an ester and water.',
  polarity: 'Molecular geometry determines whether individual bond dipoles cancel.',
  calorimetry: 'Coffee-cup calorimetry uses the solution temperature change to infer reaction heat at constant pressure.',
  'activation-energy': 'A catalyst lowers activation energy without changing reactant energy, product energy, or reaction enthalpy.',
  equilibrium: 'At dynamic equilibrium, forward and reverse rates are equal while both reactions continue.',
  titration: 'A weak-acid–strong-base titration has a buffer region and an equivalence point above pH 7.',
  electrolysis: 'An external power source drives a non-spontaneous redox reaction; oxidation remains at the anode and reduction at the cathode.',
  projectile: 'With negligible air resistance, projectile motion has constant horizontal velocity and downward vertical acceleration.',
  'free-body': 'A free-body diagram shows only the external forces acting on the isolated object.',
  'control-flow': 'A decision evaluates one Boolean condition and follows exactly one outgoing branch.',
  recursion: 'Structural recursion reduces the input until it reaches a base case.',
  collection: 'An indexed sequence stores ordered values; traversal visits indices systematically.',
  'feedback-control': 'A negative-feedback loop compares the reference with the measured output.',
  'stable-response': 'A stable underdamped step response approaches its target as transient error decays.',
  markov: 'A Markov chain moves between states according to transition probabilities.',
  'counting-process': 'A counting process records cumulative random arrivals along a continuous time axis.',
  'curve-frame': 'The tangent and principal normal vectors form part of the Frenet frame along a regular curve.',
  'tangent-plane': 'A tangent plane is the best local affine approximation to a smooth surface.',
  regression: 'A regression line summarizes a trend; a residual is the observed value minus the predicted value.',
  normal: 'A normal distribution is centred at its mean; a z-score is signed distance from the mean in standard deviations.',
  enzyme: 'An enzyme active site binds compatible substrates and lowers activation energy without changing equilibrium.',
  homeostasis: 'Negative feedback detects a deviation and produces a response that moves a regulated variable toward its set point.',
  'velocity-field': 'A velocity field assigns a flow vector to every spatial point at each time.',
  streamtube: 'For steady incompressible flow, conservation of mass links speed and cross-sectional area along a streamtube.',
  orbit: 'A bound two-body orbit is an ellipse with the attracting body at one focus.',
  oscillator: 'An ideal mass–spring oscillator has restoring force F = −kx opposite displacement.',
});

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

export function getConceptDiagramType({ courseCode = '', label = '', snippet = '' } = {}) {
  // Concept labels are curated topic identifiers. Long lesson/question prose
  // frequently mentions adjacent ideas and must not override that identity.
  const text = String(label || snippet).toLowerCase();
  const course = courseCode.toLowerCase().replace(/\s+/g, '');
  const calculus = /^(mcv4u|mhf4u)/.test(course);
  const chemistry = /^(sch4u|chem)/.test(course);
  const physics = /^(sph4u|phys)/.test(course);
  const biology = /^(sbi4u|bio|life)/.test(course);
  const computing = /^(ics4u|ece|cs|cp|geng|program)/.test(course);

  if (calculus && text.includes('average and instantaneous rate')) return 'average-rate';
  if (calculus && text.includes('continuity and discontinuities')) return 'discontinuity';
  if (calculus && includesAny(text, ['derivative from first principles', 'chain rule', 'power rule', 'product and quotient rules', 'related rates', 'derivative', 'differentiat', 'tangent'])) return 'derivative';
  if (calculus && includesAny(text, ['vector', 'dot product', 'cross product', '3d', 'magnitude'])) return 'vectors';

  if (chemistry && includesAny(text, ['periodic trends', 'atomic radius', 'ionization', 'electronegativity'])) return 'periodic-trends';
  if (chemistry && includesAny(text, ['galvanic cell', 'cell potential'])) return 'galvanic';
  if (chemistry && includesAny(text, ['organic reactions', 'esterification'])) return 'esterification';
  if (chemistry && includesAny(text, ['vsepr', 'molecular polarity', 'intermolecular'])) return 'polarity';
  if (chemistry && includesAny(text, ['enthalpy and calorimetry', 'calorimetry'])) return 'calorimetry';
  if (chemistry && includesAny(text, ['collision theory', 'activation energy', 'catalyst'])) return 'activation-energy';
  if (chemistry && includesAny(text, ['dynamic equilibrium', 'le chatelier', ' kc'])) return 'equilibrium';
  if (chemistry && includesAny(text, ['buffers and titration', 'weak-acid', 'weak acid-strong base'])) return 'titration';
  if (chemistry && includesAny(text, ['electrolytic', 'electrolysis', "faraday's law"])) return 'electrolysis';

  if (physics && text.includes('projectile')) return 'projectile';
  if (physics && includesAny(text, ['newton', 'free-body', 'friction', 'tension', 'inclined plane'])) return 'free-body';

  if (computing && includesAny(text, ['condition', 'boolean', 'control flow', 'loop', 'iteration'])) return 'control-flow';
  if (computing && includesAny(text, ['recursion', 'recursive'])) return 'recursion';
  if (computing && includesAny(text, ['array', 'list', 'collection', 'traversal', 'aggregation'])) return 'collection';

  if (/^(aer372|control)/.test(course) && includesAny(text, ['block diagram', 'controller', 'pid', 'feedback'])) return 'feedback-control';
  if (/^(aer372|control)/.test(course) && includesAny(text, ['step response', 'transient specification'])) return 'stable-response';
  if (/^act/.test(course) && includesAny(text, ['markov', 'transition', 'classification of states', 'stationary', 'absorbing chain'])) return 'markov';
  if (/^act/.test(course) && includesAny(text, ['poisson', 'waiting time', 'counting process', 'renewal', 'queue', 'arrival'])) return 'counting-process';
  if (/^(mat307|geometry)/.test(course) && (includesAny(text, ['parametrized curve', 'torsion', 'frenet', 'arc length']) || text === 'curvature')) return 'curve-frame';
  if (/^(mat307|geometry)/.test(course) && includesAny(text, ['parametrized surface', 'tangent plane'])) return 'tangent-plane';
  if (/^(mdm4u|stat|data)/.test(course) && includesAny(text, ['regression', 'correlation', 'scatter', 'residual'])) return 'regression';
  if (/^(mdm4u|stat)/.test(course) && includesAny(text, ['normal distribution', 'z-score'])) return 'normal';
  if (biology && includesAny(text, ['enzyme', 'proteins and enzymes'])) return 'enzyme';
  if (biology && includesAny(text, ['homeostasis', 'negative feedback', 'hormone', 'blood glucose', 'osmoregulation'])) return 'homeostasis';
  if (/^(aer210|fluid)/.test(course) && includesAny(text, ['velocity field', 'streamline', 'pathline', 'material derivative', 'continuum assumption'])) return 'velocity-field';
  if (/^(aer210|fluid)/.test(course) && includesAny(text, ['bernoulli', 'conservation of mass'])) return 'streamtube';
  if (/^(aer301|dynamics)/.test(course) && includesAny(text, ['orbit', 'two-body', 'orbital element', 'transfer maneuver', 'central-force'])) return 'orbit';
  if (/^(aer301|dynamics)/.test(course) && includesAny(text, ['vibration', 'oscillation', 'small oscillation'])) return 'oscillator';
  return null;
}
