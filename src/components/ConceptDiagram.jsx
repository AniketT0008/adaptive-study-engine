import { useId } from 'react';

const C = {
  purple: '#a29bfe', teal: '#55efc4', yellow: '#fdcb6e', red: '#ff7675',
  blue: '#74b9ff', ink: '#eef2ff', muted: '#9aa5b5', panel: '#151925',
};

function Arrow({ x1, y1, x2, y2, color = C.teal, dashed = false }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - 10 * Math.cos(angle - 0.55);
  const ay = y2 - 10 * Math.sin(angle - 0.55);
  const bx = x2 - 10 * Math.cos(angle + 0.55);
  const by = y2 - 10 * Math.sin(angle + 0.55);
  return <><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeDasharray={dashed ? '7 5' : undefined} /><path d={`M${x2} ${y2} L${ax} ${ay} L${bx} ${by} Z`} fill={color} /></>;
}

function Txt({ x, y, children, color = C.ink, size = 12, anchor = 'middle', weight = 600 }) {
  return <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor}>{children}</text>;
}

function Box({ x, y, w, h, children, color = C.purple }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="9" fill={C.panel} stroke={color} strokeWidth="2" /><Txt x={x + w / 2} y={y + h / 2 + 4} size="11">{children}</Txt></g>;
}

function Axes({ x = 42, y = 188, right = 386, top = 28, xLabel = 'x', yLabel = 'y' }) {
  return <><Arrow x1={x} y1={y} x2={right} y2={y} color={C.muted} /><Arrow x1={x} y1={y} x2={x} y2={top} color={C.muted} /><Txt x={right - 3} y={y + 20} color={C.muted} size="11">{xLabel}</Txt><Txt x={x - 18} y={top + 4} color={C.muted} size="11">{yLabel}</Txt></>;
}

function Frame({ label, caption, children }) {
  const clipId = useId().replace(/:/g, '');
  return (
    <figure className="concept-visual overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0d13] p-3" aria-label={`${label}: ${caption}`}>
      <div className="mb-2 min-w-0">
        <div className="truncate text-sm font-bold text-white" title={label}>{label}</div>
        <div className="text-xs leading-relaxed text-[var(--color-text-muted)]">{caption}</div>
      </div>
      <svg viewBox="0 0 420 220" className="block w-full max-w-2xl mx-auto" role="img" preserveAspectRatio="xMidYMid meet">
        <title>{`${label}: ${caption}`}</title>
        <defs><clipPath id={clipId}><rect x="8" y="8" width="404" height="204" rx="14" /></clipPath></defs>
        <rect x="8" y="8" width="404" height="204" rx="14" fill="#0f121b" stroke={C.purple} strokeOpacity="0.2" />
        <g clipPath={`url(#${clipId})`}>{children}</g>
      </svg>
    </figure>
  );
}

const normalize = (value) => String(value || '').toLowerCase().replace(/[’']/g, "'");

const RULES = [
  ['limit', /limit laws|continuity|discontinuit/],
  ['vector', /gradient and directional derivative/],
  ['derivative', /rate of change|derivative|differentiat|critical point|concavity|inflection|curve sketch|optimization|related rates/],
  ['vectorCross', /cross product|area, and torque/],
  ['vectorPlanes', /lines and planes in 3d/],
  ['vectorIntersections', /intersections and distances/],
  ['vectorDot', /dot product|projections, and work/],
  ['vectorOperations', /vector operations|linear combinations/],
  ['vector', /vector representation|\bvector\b|magnitude/],
  ['integral', /multiple integral|line integral|surface integral|green theorem|divergence and stokes|jacobian|coordinate transform/],
  ['function', /polynomial|rational function|asymptote|sinusoidal|trigonometric|logarithm|exponential|inverse function|combining function|mathematical model/],
  ['probability', /counting|permutation|combination|conditional probability|random variable|binomial|normal distribution|sampling distribution|confidence interval/],
  ['regression', /statistics|correlation|regression|residual|data collection|bias|research question|analysis plan/],
  ['projectile', /projectile|2d kinematic/],
  ['freebody', /newton|free-body|friction|tension|inclined plane|circular motion|centripetal/],
  ['energy', /work and energy|mechanical energy|power and efficiency/],
  ['momentum', /momentum|impulse|collision/],
  ['orbit', /gravitation|orbit|two-body|orbital element|transfer maneuver|central-force/],
  ['electric', /electric force|electric field|electric potential/],
  ['magnetic', /magnetic force|electromagnetic induction/],
  ['wave', /wave behaviour|interference|double-slit|diffraction|photoelectric|photon/],
  ['relativity', /relativity|rotating frame|coriolis|relative motion/],
  ['organic', /hydrocarbon|isomer|functional group|organic reaction|polymer|biochemical molecule/],
  ['atom', /quantum model|electron configuration|periodic trend/],
  ['lewis', /chemical bonding|molecular polarity|vsepr|intermolecular/],
  ['calorimetry', /enthalpy|calorimetry|hess/],
  ['kinetics', /collision theory|activation energy|rate law|reaction mechanism/],
  ['equilibrium', /dynamic equilibrium|le chatelier|\bkc\b/],
  ['titration', /acid-base|\bph\b|buffer|titration/],
  ['electrochem', /oxidation|redox|galvanic|cell potential|electrolytic|faraday/],
  ['biomolecule', /water, ph|carbohydrate|lipid|protein|enzyme|nucleic acid|\batp\b/],
  ['respiration', /glycolysis|fermentation|krebs|electron transport/],
  ['photosynthesis', /photosynthesis|calvin cycle|carbon fixation/],
  ['dna', /dna replication|transcription|rna processing|translation|protein synthesis|gene regulation|mutation|biotechnology/],
  ['homeostasis', /negative feedback|endocrine|hormone|kidney|osmoregulation/],
  ['neuron', /nervous system|signalling/],
  ['population', /population growth|carrying capacity|limiting factor|predator|prey|competition|sustainability|human impact/],
  ['flowchart', /condition|control flow|if\/elif|boolean|loop|iteration|nested loop/],
  ['trace', /variable|primitive type|expression|operator|input, output|formatting|tracing|dry-running|assignment|type conversion|console input|program tracing/],
  ['functionCode', /function|method|parameter|scope|contract|helper|local binding|lambda|composition|modular|decomposition/],
  ['collection', /array|list|collection|dictionary|stack|queue|tree|search|sort|traversal|aggregation|csv|file reading/],
  ['recursion', /recursion|recursive|backtracking|graph|reachability|termination|accumulator/],
  ['memory', /reference|alias|pointer|object reference|class|encapsulation|inheritance|polymorphism|interface/],
  ['testing', /test|debug|error handling|defensive|version control|documentation|requirement|validation|code style/],
  ['hci', /user interface|accessibility|usability|interface feedback|user testing|human oversight|ethics|privacy|security|social impact|emerging technolog/],
  ['algorithm', /algorithm|big-o|complexity|higher-order|map, filter|library|api|rule-based|classification|training data/],
  ['fluid', /continuum|velocity field|streamline|pathline|material derivative|conservation of mass|momentum balance|hydrostatic|bernoulli|viscosity|laminar|boundary condition|dimensional analysis/],
  ['mechanics', /newton-euler|generalized coordinate|lagrange|d'alembert|hamiltonian|angular momentum|euler equation/],
  ['vibration', /oscillation|vibration/],
  ['control', /differential equation model|transfer function|block diagram|linearization|pid|lead-lag|state-space|controllability|observability|pole placement|sampling|discretization/],
  ['response', /step response|transient|bode|frequency-domain|characteristic equation|routh|root locus|nyquist|steady-state error|robustness/],
  ['curve', /parametrized curve|arc length|torsion|frenet|^curvature$/],
  ['surface', /parametrized surface|tangent plane|fundamental form|area element|normal curvature|gaussian curvature|mean curvature|shape operator|covariant|parallel transport|geodesic|gauss map|egregium|gauss-bonnet|topology/],
  ['markov', /transition matr|classification of states|stationary distribution|absorbing chain/],
  ['process', /counting process|waiting time|thinning|superposition|non-homogeneous|renewal|stopping time|long-run average|claims|birth-death|m\/m\/1|ruin probability|actuarial|generating function|actuarial distribution|conditional expectation/],
];

function resolveDiagramKind({ courseCode = '', label = '', snippet = '' }) {
  // The curated lesson title is authoritative. Long definition prose often
  // mentions adjacent ideas (for example biological pH or orbital energy), so
  // it must never select a diagram from the wrong subject.
  const text = normalize(label || snippet);
  const course = normalize(courseCode).replace(/\s+/g, '');
  let allowed;
  let fallback = 'function';
  if (/^(mcv4u|mhf4u)/.test(course)) {
    allowed = new Set(['limit','derivative','vector','vectorOperations','vectorDot','vectorCross','vectorPlanes','vectorIntersections','function']);
  } else if (/^(sph4u|phys)/.test(course)) {
    allowed = new Set(['projectile','freebody','energy','momentum','orbit','electric','magnetic','wave','relativity']);
    fallback = 'freebody';
  } else if (/^(sch4u|chem)/.test(course)) {
    allowed = new Set(['organic','atom','lewis','calorimetry','kinetics','equilibrium','titration','electrochem']);
    fallback = 'lewis';
  } else if (/^(sbi4u|bio|life)/.test(course)) {
    allowed = new Set(['biomolecule','respiration','photosynthesis','dna','homeostasis','neuron','population']);
    fallback = 'biomolecule';
  } else if (/^(ics4u|ece|cs|cp|geng|program)/.test(course)) {
    allowed = new Set(['flowchart','trace','functionCode','collection','recursion','memory','testing','hci','algorithm']);
    fallback = 'trace';
  } else if (/^(mdm4u|stat|data)/.test(course)) {
    allowed = new Set(['probability','regression','function']);
    fallback = 'probability';
  } else if (/^aer210/.test(course)) {
    allowed = new Set(['derivative','vector','integral','fluid']);
    fallback = 'fluid';
  } else if (/^aer301/.test(course)) {
    allowed = new Set(['relativity','energy','momentum','mechanics','orbit','vibration']);
    fallback = 'mechanics';
  } else if (/^aer372/.test(course)) {
    allowed = new Set(['control','response']);
    fallback = 'control';
  } else if (/^mat307/.test(course)) {
    allowed = new Set(['curve','surface']);
    fallback = 'surface';
  } else if (/^act/.test(course)) {
    allowed = new Set(['probability','markov','process']);
    fallback = 'process';
  }
  const explicit = RULES.find(([kind, pattern]) => (!allowed || allowed.has(kind)) && pattern.test(text));
  if (explicit) return explicit[0];
  return fallback;
}

function Plot({ kind }) {
  if (kind === 'limit') return <><Axes /><path d="M52 174 C118 155 159 121 202 91 S304 55 382 42" fill="none" stroke={C.teal} strokeWidth="4" /><circle cx="214" cy="84" r="8" fill="#0f121b" stroke={C.red} strokeWidth="3" /><Arrow x1={140} y1={118} x2={201} y2={90} color={C.yellow} dashed /><Arrow x1={288} y1={62} x2={226} y2={80} color={C.yellow} dashed /><Txt x={214} y={120} color={C.red}>two-sided limit</Txt></>;
  if (kind === 'function') return <><Axes /><path d="M50 175 C95 25 142 38 186 130 S284 205 380 55" fill="none" stroke={C.purple} strokeWidth="4" /><line x1="62" y1="108" x2="360" y2="108" stroke={C.red} strokeDasharray="6 5" /><Txt x={327} y={99} color={C.red}>feature / asymptote</Txt></>;
  if (kind === 'regression') return <><Axes xLabel="x data" yLabel="y" />{[[68,164],[104,145],[135,153],[171,118],[205,126],[242,83],[281,94],[318,59],[359,70]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" fill={C.teal}/>)}<line x1="58" y1="174" x2="372" y2="52" stroke={C.purple} strokeWidth="3"/><line x1="205" y1="126" x2="205" y2="117" stroke={C.red} strokeWidth="3"/><Txt x={234} y={143} color={C.red}>residual</Txt></>;
  return <><Axes /><path d="M50 185 C104 184 132 158 158 83 C174 36 228 36 244 83 C270 158 308 184 382 185" fill="none" stroke={C.teal} strokeWidth="4"/><line x1="201" y1="43" x2="201" y2="188" stroke={C.yellow} strokeDasharray="6 5"/><Txt x={201} y={207} color={C.yellow}>centre / expected value</Txt></>;
}

function DerivativeVisual() { return <><Axes /><path d="M48 180 C111 169 145 126 217 94 S324 54 382 41" fill="none" stroke={C.purple} strokeWidth="4"/><line x1="142" y1="136" x2="302" y2="64" stroke={C.teal} strokeWidth="3"/><circle cx="217" cy="94" r="6" fill={C.yellow}/><Txt x={303} y={55} color={C.teal}>tangent: f'(a)</Txt><Arrow x1={97} y1={161} x2={175} y2={121} color={C.red} dashed/><Txt x={109} y={111} color={C.red}>Δy / Δx</Txt></> }
function VectorVisual({ integral = false }) { return <><Axes x={54} y={183} right={383} top={31} xLabel="x" yLabel={integral ? 'field' : 'y'} />{integral ? <><path d="M63 171 C125 52 221 42 367 126" fill="none" stroke={C.purple} strokeWidth="4"/><Arrow x1={116} y1={91} x2={164} y2={64}/><Arrow x1={221} y1={62} x2={268} y2={74}/><Txt x={220} y={205} color={C.yellow}>accumulate along the path</Txt></> : <><Arrow x1={74} y1={164} x2={278} y2={65}/><line x1="74" y1="164" x2="278" y2="164" stroke={C.red} strokeDasharray="5 4"/><line x1="278" y1="164" x2="278" y2="65" stroke={C.red} strokeDasharray="5 4"/><Txt x={175} y={181} color={C.red}>vₓ</Txt><Txt x={299} y={117} color={C.red}>vᵧ</Txt><Txt x={255} y={52} color={C.teal}>vector v</Txt></>}</> }

function extractVectors(value) {
  const matches = String(value || '').match(/[<⟨]\s*-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){1,2}\s*[>⟩]/g) || [];
  return matches.slice(0, 4).map((match) => ({
    values: match.slice(1, -1).split(',').map((part) => Number(part.trim())),
    text: match.replace(/[<>]/g, (character) => character === '<' ? '⟨' : '⟩'),
  }));
}

function vectorEndpoint(values, originX = 105, originY = 166, scale = 16) {
  const [x = 0, y = 0, z = 0] = values;
  return {
    x: originX + (x * scale) + (z * scale * 0.42),
    y: originY - (y * scale) - (z * scale * 0.38),
  };
}

function VectorLessonVisual({ kind, snippet = '' }) {
  const vectors = extractVectors(snippet);
  const first = vectors[0] || { values: [3, -4, 2], text: '⟨3, −4, 2⟩' };
  const second = vectors[1] || { values: [1, 2, 0], text: '⟨1, 2, 0⟩' };
  const result = vectors[2] || { values: [-3, 6, -3], text: '⟨−3, 6, −3⟩' };

  if (kind === 'vectorCross') {
    return <>
      <polygon points="82,160 224,132 332,74 190,102" fill={C.purple} fillOpacity="0.16" stroke={C.purple} strokeWidth="2" />
      <Arrow x1={82} y1={160} x2={224} y2={132} color={C.teal} />
      <Arrow x1={82} y1={160} x2={190} y2={102} color={C.purple} />
      <Arrow x1={82} y1={160} x2={181} y2={42} color={C.yellow} />
      <Txt x={238} y={127} color={C.teal}>u = {first.text}</Txt>
      <Txt x={145} y={91} color={C.purple}>v = {second.text}</Txt>
      <Txt x={237} y={39} color={C.yellow}>u × v = {result.text}</Txt>
      <Txt x={244} y={190} color={C.muted}>normal is perpendicular to both vectors</Txt>
    </>;
  }

  if (kind === 'vectorPlanes') {
    return <>
      <path d="M45 153 L257 83 L372 132 L160 201 Z" fill={C.teal} fillOpacity="0.16" stroke={C.teal} strokeWidth="3" />
      <circle cx="210" cy="137" r="6" fill={C.yellow} />
      <Arrow x1={210} y1={137} x2={171} y2={35} color={C.yellow} />
      <Arrow x1={210} y1={137} x2={335} y2={96} color={C.purple} />
      <Txt x={128} y={32} color={C.yellow}>normal n = {first.text}</Txt>
      <Txt x={288} y={83} color={C.purple}>line direction d</Txt>
      <Txt x={211} y={196} color={C.muted}>plane: n · (r − r₀) = 0; line: r = r₀ + td</Txt>
    </>;
  }

  if (kind === 'vectorIntersections') {
    return <>
      <path d="M38 161 L244 95 L375 139 L168 205 Z" fill={C.purple} fillOpacity="0.13" stroke={C.purple} strokeWidth="2" />
      <path d="M91 55 L333 181 L286 211 L44 85 Z" fill={C.teal} fillOpacity="0.13" stroke={C.teal} strokeWidth="2" />
      <line x1="91" y1="109" x2="316" y2="165" stroke={C.yellow} strokeWidth="5" />
      <Txt x={304} y={151} color={C.yellow}>intersection line</Txt>
      <Txt x={211} y={40} color={C.muted}>solve the equations together; rank determines the case</Txt>
    </>;
  }

  if (kind === 'vectorDot') {
    return <>
      <Arrow x1={78} y1={169} x2={317} y2={140} color={C.teal} />
      <Arrow x1={78} y1={169} x2={207} y2={52} color={C.purple} />
      <path d="M132 162 A58 58 0 0 0 120 131" fill="none" stroke={C.yellow} strokeWidth="3" />
      <line x1="207" y1="52" x2="223" y2="151" stroke={C.red} strokeDasharray="6 5" />
      <Txt x={305} y={130} color={C.teal}>u</Txt><Txt x={209} y={42} color={C.purple}>v</Txt>
      <Txt x={143} y={134} color={C.yellow}>θ</Txt>
      <Txt x={211} y={196} color={C.muted}>u · v = |u||v|cos θ; projection lies along u</Txt>
    </>;
  }

  const endFirst = vectorEndpoint(first.values);
  const endSecond = vectorEndpoint(second.values);
  return <>
    <Axes x={48} y={176} right={390} top={28} xLabel="x" yLabel="y / z" />
    <Arrow x1={105} y1={166} x2={endFirst.x} y2={endFirst.y} color={C.teal} />
    <Txt x={Math.min(365, endFirst.x + 24)} y={Math.max(30, endFirst.y - 8)} color={C.teal}>v = {first.text}</Txt>
    {kind === 'vectorOperations' && <><Arrow x1={105} y1={166} x2={endSecond.x} y2={endSecond.y} color={C.purple} /><Txt x={Math.min(360, endSecond.x + 25)} y={Math.max(45, endSecond.y + 18)} color={C.purple}>u = {second.text}</Txt></>}
    <Txt x={235} y={198} color={C.muted}>{kind === 'vectorOperations' ? 'components combine head-to-tail' : `components shown from the lesson: ${first.text}`}</Txt>
  </>;
}

function PhysicsVisual({ kind }) {
  if (kind === 'projectile') return <><Axes xLabel="horizontal" yLabel="vertical"/><path d="M55 165 Q211 20 374 165" fill="none" stroke={C.teal} strokeWidth="4"/><Arrow x1={72} y1={162} x2={137} y2={104} color={C.purple}/><Arrow x1={211} y1={49} x2={211} y2={105} color={C.red}/><Txt x={278} y={54} color={C.red}>aᵧ = −g</Txt><Txt x={118} y={184} color={C.purple}>vₓ constant</Txt></>;
  if (kind === 'energy') return <><Box x={35} y={55} w={96} h={54} color={C.purple}>initial energy</Box><Box x={163} y={55} w={96} h={54} color={C.teal}>transfer W</Box><Box x={291} y={55} w={96} h={54} color={C.yellow}>final energy</Box><Arrow x1={131} y1={82} x2={163} y2={82}/><Arrow x1={259} y1={82} x2={291} y2={82}/><Txt x={211} y={151}>Eᵢ + W = E_f</Txt><Txt x={211} y={178} color={C.muted}>define the system boundary first</Txt></>;
  if (kind === 'momentum') return <><circle cx="89" cy="80" r="26" fill={C.purple}/><circle cx="203" cy="80" r="35" fill={C.teal}/><Arrow x1={116} y1={80} x2={156} y2={80}/><Arrow x1={239} y1={80} x2={321} y2={80} color={C.yellow}/><Box x={302} y={55} w={83} h={50} color={C.yellow}>after</Box><Txt x={211} y={150}>Σp before = Σp after</Txt><Txt x={211} y={177} color={C.muted}>impulse changes system momentum</Txt></>;
  if (kind === 'orbit') return <><ellipse cx="214" cy="111" rx="156" ry="72" fill="none" stroke={C.purple} strokeWidth="4"/><circle cx="149" cy="111" r="17" fill={C.yellow}/><circle cx="344" cy="80" r="9" fill={C.teal}/><Arrow x1={344} y1={80} x2={309} y2={48}/><Arrow x1={344} y1={80} x2={291} y2={95} color={C.red}/><Txt x={148} y={145} color={C.yellow}>focus</Txt><Txt x={300} y={35} color={C.teal}>velocity</Txt><Txt x={275} y={120} color={C.red}>gravity</Txt></>;
  if (kind === 'electric' || kind === 'magnetic') return <>{[70,140,210,280,350].map((x,i)=><Arrow key={x} x1={x} y1={170} x2={x+(kind==='magnetic'?35:0)} y2={55+(i%2)*8} color={i%2?C.purple:C.teal}/>)}<circle cx="211" cy="112" r="18" fill={C.yellow}/><Txt x={211} y={117} color="#111">q</Txt><Txt x={211} y={205} color={C.muted}>{kind === 'magnetic' ? 'F = qv × B (direction matters)' : 'field direction gives force on +q'}</Txt></>;
  if (kind === 'wave') return <><path d="M38 112 C72 44 106 44 140 112 S208 180 242 112 S310 44 378 112" fill="none" stroke={C.teal} strokeWidth="4"/><line x1="72" y1="52" x2="276" y2="52" stroke={C.yellow} strokeWidth="2"/><Txt x={174} y={42} color={C.yellow}>wavelength λ</Txt><line x1="38" y1="112" x2="378" y2="112" stroke={C.muted} strokeDasharray="5 5"/><Txt x={211} y={197} color={C.muted}>superposition sets interference intensity</Txt></>;
  if (kind === 'relativity') return <><Box x={36} y={56} w={120} h={58} color={C.purple}>frame A</Box><Box x={265} y={56} w={120} h={58} color={C.teal}>frame B</Box><Arrow x1={156} y1={85} x2={265} y2={85} color={C.yellow}/><Txt x={211} y={73} color={C.yellow}>relative v</Txt><Txt x={211} y={153}>measurements depend on frame</Txt><Txt x={211} y={181} color={C.muted}>identify invariant quantities</Txt></>;
  return <><rect x="166" y="89" width="88" height="55" rx="8" fill={C.purple}/><Arrow x1={210} y1={89} x2={210} y2={35}/><Arrow x1={210} y1={144} x2={210} y2={194} color={C.red}/><Arrow x1={254} y1={116} x2={355} y2={116} color={C.yellow}/><Arrow x1={166} y1={116} x2={65} y2={116} color={C.blue}/><Txt x={243} y={45} color={C.teal}>normal</Txt><Txt x={248} y={191} color={C.red}>weight</Txt><Txt x={326} y={104} color={C.yellow}>applied</Txt><Txt x={87} y={104} color={C.blue}>friction</Txt></>;
}

function ChemistryVisual({ kind }) {
  if (kind === 'organic') return <><Txt x={72} y={72} color={C.purple}>CH₃—C—OH</Txt><Txt x={211} y={72}>+</Txt><Txt x={317} y={72} color={C.teal}>HO—CH₂CH₃</Txt><Arrow x1={92} y1={122} x2={330} y2={122} color={C.yellow}/><Txt x={211} y={112} color={C.yellow}>H⁺, heat</Txt><Txt x={211} y={164} color={C.teal}>CH₃COOCH₂CH₃ + H₂O</Txt><Txt x={211} y={193} color={C.muted}>bonds and atoms are conserved</Txt></>;
  if (kind === 'atom') return <><circle cx="211" cy="111" r="20" fill={C.purple}/>{[45,75,105].map((r,i)=><circle key={r} cx="211" cy="111" r={r} fill="none" stroke={[C.teal,C.blue,C.yellow][i]} strokeWidth="2"/>)}{[[211,66],[286,111],[137,111],[211,6]].map(([x,y],i)=><circle key={i} cx={x} cy={Math.max(16,y)} r="6" fill={C.red}/>)}<Txt x={211} y={116}>Z</Txt><Txt x={211} y={210} color={C.muted}>shell, shielding, and nuclear charge set trends</Txt></>;
  if (kind === 'calorimetry') return <><path d="M116 39 L132 181 H290 L306 39" fill="#172630" stroke={C.purple} strokeWidth="4"/><path d="M134 105 H288 L280 177 H142 Z" fill="#21483f"/><line x1="247" y1="33" x2="247" y2="151" stroke={C.red} strokeWidth="5"/><circle cx="247" cy="151" r="10" fill={C.red}/><Txt x={211} y={204} color={C.yellow}>q_solution = mcΔT; q_rxn = −q_solution</Txt></>;
  if (kind === 'kinetics') return <><Axes xLabel="reaction progress" yLabel="energy"/><path d="M50 171 C110 169 126 35 207 34 S292 159 380 123" fill="none" stroke={C.red} strokeWidth="4"/><path d="M50 171 C121 168 145 85 207 84 S298 151 380 123" fill="none" stroke={C.teal} strokeWidth="4"/><Txt x={134} y={54} color={C.red}>uncatalyzed Eₐ</Txt><Txt x={162} y={101} color={C.teal}>catalyzed Eₐ</Txt></>;
  if (kind === 'equilibrium') return <><Box x={38} y={75} w={110} h={62} color={C.purple}>reactants</Box><Box x={272} y={75} w={110} h={62} color={C.teal}>products</Box><Arrow x1={148} y1={92} x2={272} y2={92} color={C.yellow}/><Arrow x1={272} y1={121} x2={148} y2={121} color={C.red}/><Txt x={211} y={183}>r_forward = r_reverse</Txt></>;
  if (kind === 'titration') return <><Axes xLabel="titrant volume" yLabel="pH"/><path d="M50 176 C132 170 194 160 224 125 C249 96 234 38 370 33" fill="none" stroke={C.teal} strokeWidth="4"/><line x1="238" y1="30" x2="238" y2="188" stroke={C.yellow} strokeDasharray="6 5"/><Txt x={282} y={63} color={C.yellow}>equivalence</Txt><Txt x={142} y={145} color={C.purple}>buffer region</Txt></>;
  if (kind === 'electrochem') return <><rect x="38" y="90" width="125" height="82" rx="10" fill="#172630" stroke={C.purple} strokeWidth="3"/><rect x="257" y="90" width="125" height="82" rx="10" fill="#172630" stroke={C.teal} strokeWidth="3"/><Arrow x1={111} y1={52} x2={309} y2={52} color={C.yellow}/><Txt x={211} y={40} color={C.yellow}>electron flow</Txt><Txt x={100} y={119} color={C.purple}>anode</Txt><Txt x={100} y={145}>oxidation</Txt><Txt x={319} y={119} color={C.teal}>cathode</Txt><Txt x={319} y={145}>reduction</Txt><path d="M163 130 C190 107 230 107 257 130" fill="none" stroke={C.blue} strokeWidth="5"/><Txt x={211} y={198} color={C.muted}>salt bridge maintains charge balance</Txt></>;
  return <><circle cx="211" cy="111" r="22" fill={C.purple}/>{[[112,63],[310,63],[112,159],[310,159]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="16" fill={C.teal}/><line x1={211+(x<211?-18:18)} y1={111+(y<111?-10:10)} x2={x+(x<211?16:-16)} y2={y+(y<111?8:-8)} stroke={C.muted} strokeWidth="5"/></g>)}<Txt x={211} y={116}>C</Txt><Txt x={211} y={204} color={C.muted}>Lewis domains → 3D shape → molecular polarity</Txt></>;
}

function BiologyVisual({ kind }) {
  if (kind === 'dna') return <>{[0,1,2,3,4,5].map((i)=><g key={i}><circle cx={115+i*38} cy={48+i%2*26} r="7" fill={C.purple}/><circle cx={305-i*38} cy={48+i%2*26} r="7" fill={C.teal}/><line x1={122+i*38} y1={48+i%2*26} x2={298-i*38} y2={48+i%2*26} stroke={C.muted} strokeWidth="2"/></g>)}<Arrow x1={89} y1={127} x2={180} y2={127} color={C.yellow}/><Box x={180} y={105} w={82} h={44} color={C.yellow}>RNA</Box><Arrow x1={262} y1={127} x2={354} y2={127} color={C.red}/><Txt x={211} y={187}>DNA → RNA → protein / regulation</Txt></>;
  if (kind === 'respiration' || kind === 'photosynthesis') return <><Box x={26} y={76} w={105} h={58} color={C.purple}>{kind === 'respiration' ? 'glucose' : 'light + H₂O'}</Box><Box x={158} y={76} w={105} h={58} color={C.teal}>{kind === 'respiration' ? 'pathways' : 'chloroplast'}</Box><Box x={290} y={76} w={105} h={58} color={C.yellow}>{kind === 'respiration' ? 'ATP + CO₂' : 'sugar + O₂'}</Box><Arrow x1={131} y1={105} x2={158} y2={105}/><Arrow x1={263} y1={105} x2={290} y2={105}/><Txt x={211} y={179} color={C.muted}>track matter, electrons, and energy separately</Txt></>;
  if (kind === 'homeostasis') return <><circle cx="211" cy="108" r="42" fill={C.panel} stroke={C.teal} strokeWidth="3"/><Txt x={211} y={113}>set point</Txt><path d="M211 42 C331 35 374 102 327 170" fill="none" stroke={C.purple} strokeWidth="4"/><path d="M327 170 l-2 -15 -13 8 z" fill={C.purple}/><path d="M307 181 C190 219 74 177 83 86" fill="none" stroke={C.yellow} strokeWidth="4"/><path d="M83 86 l-8 13 15 2 z" fill={C.yellow}/><Txt x={329} y={58} color={C.purple}>response</Txt><Txt x={131} y={197} color={C.yellow}>negative feedback</Txt></>;
  if (kind === 'neuron') return <><circle cx="105" cy="110" r="34" fill={C.purple}/>{[40,53,66,79].map((y,i)=><line key={i} x1="73" y1="98" x2={32+i*5} y2={y} stroke={C.purple} strokeWidth="4"/>)}<path d="M139 110 H328" stroke={C.teal} strokeWidth="8"/><path d="M328 110 l-18 -12 v24 z" fill={C.teal}/><circle cx="360" cy="90" r="6" fill={C.yellow}/><circle cx="372" cy="110" r="6" fill={C.yellow}/><circle cx="360" cy="130" r="6" fill={C.yellow}/><Txt x={230} y={94} color={C.teal}>action potential</Txt><Txt x={350} y={160} color={C.yellow}>neurotransmitter</Txt></>;
  if (kind === 'population') return <><Axes xLabel="time" yLabel="population"/><line x1="48" y1="65" x2="380" y2="65" stroke={C.red} strokeDasharray="7 5"/><Txt x={351} y={54} color={C.red}>K</Txt><path d="M50 181 C126 178 182 151 220 103 S305 65 380 65" fill="none" stroke={C.teal} strokeWidth="4"/><Txt x={211} y={205} color={C.muted}>resources and interactions shape growth</Txt></>;
  return <><path d="M92 55 C42 87 54 169 117 178 C163 184 190 151 181 113 C157 132 121 127 111 98 C103 77 119 57 138 41 C120 34 104 41 92 55 Z" fill={C.purple}/><path d="M286 70 l46 29 -31 50 -45 -28 z" fill={C.teal}/><Arrow x1={190} y1={112} x2={249} y2={112} color={C.yellow}/><Txt x={113} y={203}>structure / enzyme</Txt><Txt x={299} y={176}>substrate / signal</Txt></>;
}

function CodeVisual({ kind }) {
  if (kind === 'flowchart') return <><Box x={153} y={26} w={114} h={44} color={C.blue}>read input</Box><path d="M210 88 l70 42 -70 42 -70 -42 z" fill={C.panel} stroke={C.purple} strokeWidth="3"/><Txt x={210} y={135}>condition?</Txt><Arrow x1={140} y1={130} x2={62} y2={130} color={C.teal}/><Arrow x1={280} y1={130} x2={358} y2={130} color={C.red}/><Txt x={91} y={118} color={C.teal}>true</Txt><Txt x={329} y={118} color={C.red}>false</Txt><Box x={24} y={151} w={76} h={38} color={C.teal}>update</Box><Box x={320} y={151} w={76} h={38} color={C.red}>else</Box></>;
  if (kind === 'collection') return <>{[0,1,2,3,4].map((i)=><g key={i}><rect x={50+i*65} y="79" width="54" height="54" rx="7" fill={i===2?'#21483f':C.panel} stroke={i===2?C.teal:C.muted} strokeWidth="2"/><Txt x={77+i*65} y={111}>{[8,3,9,2,6][i]}</Txt><Txt x={77+i*65} y={151} color={C.muted} size="10">{i}</Txt></g>)}<Arrow x1={107} y1={50} x2={246} y2={50} color={C.yellow}/><Txt x={176} y={39} color={C.yellow}>traverse / search</Txt><Txt x={211} y={195} color={C.muted}>pseudocode: for each item → test → update</Txt></>;
  if (kind === 'recursion') return <><Box x={34} y={36} w={92} h={42} color={C.purple}>solve(n)</Box><Box x={164} y={82} w={92} h={42} color={C.teal}>solve(n−1)</Box><Box x={294} y={128} w={92} h={42} color={C.yellow}>base case</Box><Arrow x1={126} y1={57} x2={164} y2={88}/><Arrow x1={256} y1={103} x2={294} y2={134}/><Txt x={178} y={190} color={C.muted}>return result while calls unwind</Txt></>;
  if (kind === 'memory') return <><Box x={30} y={54} w={110} h={55} color={C.purple}>reference p</Box><Arrow x1={140} y1={82} x2={276} y2={82} color={C.yellow}/><Box x={276} y={54} w={110} h={55} color={C.teal}>object</Box><Box x={155} y={145} w={110} h={44} color={C.blue}>class contract</Box><Arrow x1={210} y1={145} x2={318} y2={109} color={C.blue}/><Txt x={211} y={129} color={C.muted}>aliasing affects shared state</Txt></>;
  if (kind === 'testing') return <><Box x={28} y={66} w={98} h={50} color={C.purple}>test case</Box><Box x={161} y={66} w={98} h={50} color={C.teal}>actual</Box><Box x={294} y={66} w={98} h={50} color={C.yellow}>expected</Box><Arrow x1={126} y1={91} x2={161} y2={91}/><Arrow x1={259} y1={91} x2={294} y2={91}/><Txt x={211} y={154} color={C.red}>first mismatch → violated invariant</Txt><Txt x={211} y={184} color={C.muted}>normal + boundary + invalid inputs</Txt></>;
  if (kind === 'hci') return <><rect x="95" y="34" width="230" height="142" rx="12" fill={C.panel} stroke={C.blue} strokeWidth="3"/><rect x="117" y="58" width="186" height="34" rx="7" fill="#20263a"/><Box x={117} y={112} w={74} h={38} color={C.teal}>action</Box><Box x={229} y={112} w={74} h={38} color={C.yellow}>feedback</Box><Arrow x1={191} y1={131} x2={229} y2={131}/><Txt x={211} y={202} color={C.muted}>visible state + keyboard + readable contrast</Txt></>;
  if (kind === 'algorithm') return <><Box x={31} y={68} w={102} h={52} color={C.purple}>input n</Box><Box x={159} y={68} w={102} h={52} color={C.teal}>algorithm</Box><Box x={287} y={68} w={102} h={52} color={C.yellow}>output</Box><Arrow x1={133} y1={94} x2={159} y2={94}/><Arrow x1={261} y1={94} x2={287} y2={94}/><Txt x={211} y={158}>cost T(n) grows with input size</Txt><Txt x={211} y={188} color={C.muted}>pseudocode: initialize → repeat → return</Txt></>;
  return <><Box x={25} y={56} w={108} h={54} color={C.purple}>input / state</Box><Box x={156} y={56} w={108} h={54} color={C.teal}>statement</Box><Box x={287} y={56} w={108} h={54} color={C.yellow}>new state</Box><Arrow x1={133} y1={83} x2={156} y2={83}/><Arrow x1={264} y1={83} x2={287} y2={83}/><Txt x={211} y={151}>pseudocode: value ← expression</Txt><Txt x={211} y={181} color={C.muted}>trace types, values, and scope after each line</Txt></>;
}

function UniversityVisual({ kind }) {
  if (kind === 'fluid') return <><path d="M27 52 C148 70 264 46 395 35 L395 178 C264 157 148 139 27 161 Z" fill="#172630" stroke={C.teal} strokeWidth="3"/><line x1="112" y1="64" x2="112" y2="149" stroke={C.purple} strokeWidth="3"/><line x1="330" y1="43" x2="330" y2="168" stroke={C.yellow} strokeWidth="3"/><Arrow x1={139} y1={109} x2={299} y2={109}/><Txt x={112} y={191} color={C.purple}>A₁, v₁</Txt><Txt x={330} y={191} color={C.yellow}>A₂, v₂</Txt></>;
  if (kind === 'vibration') return <><rect x="28" y="35" width="20" height="150" fill={C.muted}/><path d="M48 111 l26 -24 26 48 26 -48 26 48 26 -24" fill="none" stroke={C.purple} strokeWidth="4"/><rect x="178" y="73" width="90" height="76" rx="9" fill={C.panel} stroke={C.teal} strokeWidth="3"/><Txt x={223} y={116}>mass m</Txt><Arrow x1={268} y1={111} x2={370} y2={111} color={C.yellow}/><Txt x={320} y={98} color={C.yellow}>x(t)</Txt><Txt x={211} y={195} color={C.muted}>mẍ + cẋ + kx = F(t)</Txt></>;
  if (kind === 'control' || kind === 'response') return kind === 'control' ? <><circle cx="75" cy="102" r="20" fill={C.panel} stroke={C.purple} strokeWidth="3"/><Txt x={75} y={107}>Σ</Txt><Box x={123} y={73} w={90} h={58} color={C.teal}>controller</Box><Box x={264} y={73} w={90} h={58} color={C.yellow}>plant</Box><Arrow x1={24} y1={102} x2={55} y2={102}/><Arrow x1={95} y1={102} x2={123} y2={102}/><Arrow x1={213} y1={102} x2={264} y2={102}/><Arrow x1={354} y1={102} x2={397} y2={102}/><path d="M377 102 V181 H75 V122" fill="none" stroke={C.red} strokeWidth="3"/><Txt x={230} y={198} color={C.red}>measured feedback</Txt></> : <><Axes xLabel="time" yLabel="response"/><line x1="45" y1="66" x2="385" y2="66" stroke={C.muted} strokeDasharray="6 5"/><path d="M48 182 C78 179 82 25 124 54 S176 93 210 62 S266 70 306 66 S352 66 382 66" fill="none" stroke={C.teal} strokeWidth="4"/><Txt x={135} y={35} color={C.yellow}>overshoot</Txt><Txt x={336} y={54} color={C.muted}>target</Txt></>;
  if (kind === 'curve' || kind === 'surface') return kind === 'curve' ? <><path d="M35 163 C103 152 130 47 223 72 S331 173 390 49" fill="none" stroke={C.purple} strokeWidth="4"/><circle cx="223" cy="72" r="6" fill={C.yellow}/><Arrow x1={164} y1={57} x2={298} y2={91}/><Arrow x1={223} y1={72} x2={202} y2={153} color={C.red}/><Txt x={302} y={83} color={C.teal}>T</Txt><Txt x={191} y={169} color={C.red}>N</Txt></> : <><path d="M48 154 Q211 27 374 154 Q211 210 48 154" fill="#171f2c" stroke={C.purple} strokeWidth="3"/><path d="M122 137 L275 86 L329 143 L175 194 Z" fill={C.teal} fillOpacity=".18" stroke={C.teal} strokeWidth="2"/><Arrow x1={230} y1={133} x2={230} y2={37} color={C.yellow}/><Txt x={285} y={81} color={C.teal}>tangent plane</Txt></>;
  if (kind === 'markov') return <><circle cx="100" cy="109" r="42" fill={C.panel} stroke={C.purple} strokeWidth="3"/><circle cx="320" cy="109" r="42" fill={C.panel} stroke={C.teal} strokeWidth="3"/><Txt x={100} y={114}>S₁</Txt><Txt x={320} y={114}>S₂</Txt><path d="M142 92 C198 43 262 43 278 92" fill="none" stroke={C.yellow} strokeWidth="3"/><path d="M278 126 C230 177 174 177 142 126" fill="none" stroke={C.red} strokeWidth="3"/><Txt x={211} y={54} color={C.yellow}>p₁₂</Txt><Txt x={211} y={180} color={C.red}>p₂₁</Txt></>;
  return <><line x1="38" y1="112" x2="385" y2="112" stroke={C.muted} strokeWidth="3"/>{[82,139,224,269,344].map((x,i)=><g key={x}><line x1={x} y1="87" x2={x} y2="137" stroke={C.teal} strokeWidth="3"/><circle cx={x} cy="87" r="6" fill={C.yellow}/><Txt x={x} y={158} color={C.muted} size="10">{i+1}</Txt></g>)}<Txt x={211} y={61} color={C.purple}>random arrivals / transitions</Txt><Txt x={211} y={198} color={C.muted}>model rates, rewards, and long-run behaviour</Txt></>;
}

const CAPTIONS = {
  limit: 'Approach the target from both sides before evaluating continuity.', derivative: 'The local tangent slope represents instantaneous change.', vector: 'The arrow uses the actual components supplied by this lesson.', vectorOperations: 'The lesson vectors are combined component-by-component and head-to-tail.', vectorDot: 'The dot product connects angle, projection, and directional work.', vectorCross: 'The cross product is normal to the plane spanned by the lesson vectors.', vectorPlanes: 'A line uses a point and direction; a plane uses a point and normal.', vectorIntersections: 'Simultaneous equations and rank distinguish line and plane intersection cases.', integral: 'Accumulate a field along a path, surface, or region.', function: 'Read transformations, roots, extrema, and restrictions from the graph.', probability: 'Define the random variable and model before calculating probability.', regression: 'Data, model, residuals, and uncertainty must be interpreted together.', projectile: 'Horizontal and vertical motion share time but obey different acceleration rules.', freebody: 'Isolate one system and draw every external force with direction.', energy: 'Energy accounting depends on the chosen system and transfers across its boundary.', momentum: 'Momentum is conserved only for the defined isolated system.', orbit: 'Gravity points toward a focus while velocity is tangent to the path.', electric: 'Field direction and charge sign determine the electric force.', magnetic: 'The cross product sets the magnetic-force magnitude and direction.', wave: 'Wavelength, phase, and superposition determine the observed pattern.', relativity: 'State the reference frame before comparing space, time, or velocity.', organic: 'Structural formulas make conserved atoms and changed bonds explicit.', atom: 'Electron shells, shielding, and nuclear charge explain atomic trends.', lewis: 'Lewis electrons determine domains; domains determine 3D shape and polarity.', calorimetry: 'Temperature change measures heat transferred between system and surroundings.', kinetics: 'Reaction pathways and activation barriers control rate.', equilibrium: 'Forward and reverse processes continue at equal rates.', titration: 'A titration curve links composition, buffer behaviour, and equivalence.', electrochem: 'Oxidation and reduction are separated while charge remains balanced.', biomolecule: 'Biological function follows from molecular structure and binding.', respiration: 'Track carbon, electrons, and ATP through respiration pathways.', photosynthesis: 'Light energy drives electron transfer and carbon fixation.', dna: 'Sequence information flows through replication, expression, and regulation.', homeostasis: 'Negative feedback detects a deviation and restores a regulated variable.', neuron: 'Electrical signalling along a neuron triggers chemical communication.', population: 'Growth changes as resources, density, and species interactions change.', flowchart: 'Pseudocode branches or repeats only after evaluating a condition.', trace: 'Trace each statement from input state to output state.', functionCode: 'A function contract connects inputs, transformation, and returned output.', collection: 'Indexes and traversal rules determine how a collection is processed.', recursion: 'Each recursive call must reduce toward a base case.', memory: 'References, objects, and aliases determine where state lives.', testing: 'Tests compare actual behaviour with a contract at normal and boundary cases.', hci: 'Interface feedback and accessibility make system state understandable.', algorithm: 'Pseudocode exposes the invariant and cost of an algorithm.', fluid: 'A streamtube connects velocity, area, pressure, and conservation laws.', mechanics: 'Choose coordinates, account for forces, then write the governing dynamics.', vibration: 'Mass, damping, and stiffness determine oscillatory response.', control: 'A feedback loop compares desired and measured output.', response: 'Transient and frequency plots expose stability and performance.', curve: 'Tangent, normal, curvature, and arc length describe a curve locally.', surface: 'Tangent geometry and curvature describe a surface locally and globally.', markov: 'Transition probabilities govern movement between states.', process: 'Random events accumulate along time according to a stochastic model.',
};

export default function ConceptDiagram(props) {
  const kind = resolveDiagramKind(props);
  const caption = CAPTIONS[kind] || 'The diagram shows the governing structure of this lesson.';
  let visual;
  if (['limit', 'function', 'probability', 'regression'].includes(kind)) visual = <Plot kind={kind} />;
  else if (kind === 'derivative') visual = <DerivativeVisual />;
  else if (['vector','vectorOperations','vectorDot','vectorCross','vectorPlanes','vectorIntersections'].includes(kind)) visual = <VectorLessonVisual kind={kind} snippet={`${props.snippet || ''} ${props.example || ''}`} />;
  else if (kind === 'integral') visual = <VectorVisual integral />;
  else if (['projectile','freebody','energy','momentum','orbit','electric','magnetic','wave','relativity'].includes(kind)) visual = <PhysicsVisual kind={kind} />;
  else if (['organic','atom','lewis','calorimetry','kinetics','equilibrium','titration','electrochem'].includes(kind)) visual = <ChemistryVisual kind={kind} />;
  else if (['biomolecule','respiration','photosynthesis','dna','homeostasis','neuron','population'].includes(kind)) visual = <BiologyVisual kind={kind} />;
  else if (['flowchart','trace','functionCode','collection','recursion','memory','testing','hci','algorithm'].includes(kind)) visual = <CodeVisual kind={kind} />;
  else visual = <UniversityVisual kind={kind} />;
  return <Frame label={props.label || 'Concept diagram'} caption={caption}>{visual}</Frame>;
}
