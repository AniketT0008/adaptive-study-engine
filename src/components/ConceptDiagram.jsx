function Frame({ children, label, accent = '#a29bfe' }) {
  return (
    <figure className="concept-visual rounded-xl border border-white/[0.08] bg-[#0b0d13] p-3" aria-label={label}>
      <svg viewBox="0 0 360 190" className="w-full max-w-xl mx-auto block" role="img">
        <title>{label}</title>
        <rect x="1" y="1" width="358" height="188" rx="16" fill="none" stroke={accent} strokeOpacity="0.18" />
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">{label}</figcaption>
    </figure>
  );
}

const axes = (
  <>
    <line x1="35" y1="155" x2="335" y2="155" stroke="#697386" strokeWidth="2" />
    <line x1="35" y1="155" x2="35" y2="25" stroke="#697386" strokeWidth="2" />
  </>
);

export default function ConceptDiagram({ courseCode = '', label = '', snippet = '' }) {
  const text = `${label} ${snippet}`.toLowerCase();
  const course = courseCode.toLowerCase();

  // Prefer lesson-specific visuals. The course-aware fallbacks below prevent a
  // keyword such as "energy" in chemistry from accidentally selecting physics.
  if (/average and instantaneous rate/.test(text)) {
    return <Frame label="Average rate uses a secant through two points.">{axes}<path d="M45 138 C108 132 142 88 205 68 S286 42 325 33" fill="none" stroke="#a29bfe" strokeWidth="4" /><line x1="82" y1="126" x2="260" y2="50" stroke="#55efc4" strokeWidth="3" /><circle cx="82" cy="126" r="5" fill="#fdcb6e" /><circle cx="260" cy="50" r="5" fill="#fdcb6e" /><text x="104" y="83" fill="#55efc4" fontSize="13">secant</text><text x="112" y="177" fill="#b2bec3" fontSize="11">two points → one interval</text></Frame>;
  }

  if (/continuity and discontinuities/.test(text)) {
    return <Frame label="A removable discontinuity is a hole where the limit exists.">{axes}<path d="M45 135 C90 112 130 105 177 84 S250 52 322 42" fill="none" stroke="#55efc4" strokeWidth="4" /><circle cx="205" cy="72" r="7" fill="#0b0d13" stroke="#ff7675" strokeWidth="3" /><text x="220" y="68" fill="#ff7675" fontSize="12">hole</text><text x="220" y="85" fill="#b2bec3" fontSize="11">limit exists</text></Frame>;
  }

  if (/derivative from first principles|chain rule|power rule|product and quotient rules|related rates|derivative|differentiat|tangent/.test(text) && /mat|math|calc|mcv|act/.test(course)) {
    return <Frame label="The tangent line represents instantaneous rate at one point.">{axes}<path d="M45 140 C105 130 138 88 205 68 S290 40 325 32" fill="none" stroke="#a29bfe" strokeWidth="4" /><line x1="165" y1="100" x2="270" y2="30" stroke="#55efc4" strokeWidth="3" /><circle cx="205" cy="68" r="6" fill="#fdcb6e" /><text x="246" y="27" fill="#55efc4" fontSize="12">tangent</text><text x="182" y="178" fill="#b2bec3" fontSize="11">at x = a</text></Frame>;
  }

  if (/vector|dot product|cross product|3d|magnitude/.test(text) && /mat|math|mcv|act/.test(course)) {
    return <Frame label="Vector components show direction and magnitude along each axis.">{axes}<line x1="35" y1="155" x2="250" y2="62" stroke="#55efc4" strokeWidth="4" /><path d="M250 62 l-16 1 8 12 z" fill="#55efc4" /><line x1="35" y1="155" x2="205" y2="125" stroke="#a29bfe" strokeWidth="4" /><path d="M205 125 l-14 -4 3 14 z" fill="#a29bfe" /><text x="257" y="61" fill="#55efc4" fontSize="13">v</text><text x="212" y="128" fill="#a29bfe" fontSize="13">u</text><text x="88" y="177" fill="#b2bec3" fontSize="11">components combine to form the vector</text></Frame>;
  }

  if (/periodic trends|atomic radius|ionization|electronegativity/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="Across a period, effective nuclear charge pulls electrons closer.">{[<circle key="1" cx="105" cy="95" r="51" fill="none" stroke="#a29bfe" strokeWidth="3" />, <circle key="2" cx="105" cy="95" r="18" fill="#6c5ce7" />, <circle key="3" cx="257" cy="95" r="35" fill="none" stroke="#55efc4" strokeWidth="3" />, <circle key="4" cx="257" cy="95" r="18" fill="#00cec9" />, <path key="5" d="M166 95 H202" stroke="#fdcb6e" strokeWidth="4" />, <path key="6" d="M202 95 l-11 -8 v16 z" fill="#fdcb6e" />, <text key="7" x="79" y="100" fill="white" fontSize="11">lower Z</text>, <text key="8" x="231" y="100" fill="#0f1117" fontSize="11">higher Z</text>] }<text x="104" y="174" fill="#b2bec3" fontSize="11">same shell + stronger pull</text></Frame>;
  }

  if (/galvanic cells?|cell potential|redox/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="Electrons flow from oxidation at the anode to reduction at the cathode."><rect x="35" y="70" width="100" height="70" rx="8" fill="#1a1d27" stroke="#a29bfe" strokeWidth="2" /><rect x="225" y="70" width="100" height="70" rx="8" fill="#1a1d27" stroke="#55efc4" strokeWidth="2" /><line x1="96" y1="38" x2="264" y2="38" stroke="#fdcb6e" strokeWidth="4" /><path d="M264 38 l-12 -8 v16 z" fill="#fdcb6e" /><text x="49" y="95" fill="#a29bfe" fontSize="12">anode</text><text x="49" y="113" fill="#b2bec3" fontSize="11">oxidation</text><text x="239" y="95" fill="#55efc4" fontSize="12">cathode</text><text x="239" y="113" fill="#b2bec3" fontSize="11">reduction</text><text x="137" y="29" fill="#fdcb6e" fontSize="11">e− flow</text></Frame>;
  }

  if (/organic reactions|esterification/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="Esterification combines a carboxylic acid and an alcohol."><text x="18" y="82" fill="#a29bfe" fontSize="16">acid</text><text x="111" y="82" fill="#b2bec3" fontSize="14">+</text><text x="140" y="82" fill="#55efc4" fontSize="16">alcohol</text><path d="M79 111 H280" stroke="#fdcb6e" strokeWidth="3" /><path d="M280 111 l-12 -8 v16 z" fill="#fdcb6e" /><text x="128" y="102" fill="#fdcb6e" fontSize="11">H+, heat</text><text x="75" y="150" fill="#55efc4" fontSize="15">ester + H₂O</text></Frame>;
  }

  if (/vsepr|molecular polarity|intermolecular/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="Molecular shape determines whether individual bond dipoles cancel."><circle cx="180" cy="98" r="18" fill="#6c5ce7" /><circle cx="105" cy="55" r="14" fill="#55efc4" /><circle cx="255" cy="55" r="14" fill="#55efc4" /><line x1="164" y1="88" x2="117" y2="61" stroke="#b2bec3" strokeWidth="5" /><line x1="196" y1="88" x2="243" y2="61" stroke="#b2bec3" strokeWidth="5" /><path d="M180 80 V38" stroke="#fdcb6e" strokeWidth="3" /><path d="M180 38 l-8 12 h16 z" fill="#fdcb6e" /><text x="153" y="129" fill="white" fontSize="11">central atom</text><text x="137" y="166" fill="#fdcb6e" fontSize="11">bent shape → net dipole</text></Frame>;
  }

  if (/enthalpy|calorimetry/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="Calorimetry uses the solution's temperature change to infer reaction heat."><path d="M105 45 L120 151 H240 L255 45" fill="#172630" stroke="#a29bfe" strokeWidth="3" /><path d="M122 92 H238 L232 145 H128 Z" fill="#21483f" /><line x1="205" y1="30" x2="205" y2="126" stroke="#ff7675" strokeWidth="5" /><circle cx="205" cy="128" r="9" fill="#ff7675" /><path d="M152 83 C139 67 158 58 146 43 M180 83 C167 67 186 58 174 43" fill="none" stroke="#fdcb6e" strokeWidth="3" /><text x="126" y="174" fill="#b2bec3" fontSize="11">qreaction = −mcΔT</text></Frame>;
  }

  if (/collision theory|activation energy|catalyst|rate law|reaction mechanism/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="A catalyst lowers activation energy without changing reactant or product enthalpy.">{axes}<path d="M45 135 C92 133 110 38 176 36 S249 129 322 96" fill="none" stroke="#ff7675" strokeWidth="4" /><path d="M45 135 C105 132 125 73 178 72 S250 124 322 96" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="72" y1="135" x2="72" y2="36" stroke="#697386" strokeDasharray="4 4" /><text x="83" y="50" fill="#ff7675" fontSize="10">uncatalyzed Ea</text><text x="92" y="88" fill="#55efc4" fontSize="10">catalyzed Ea</text></Frame>;
  }

  if (/dynamic equilibrium|le chatelier|\bkc\b/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="At dynamic equilibrium, forward and reverse rates are equal while particles keep reacting."><circle cx="78" cy="76" r="14" fill="#a29bfe" /><circle cx="78" cy="119" r="14" fill="#a29bfe" /><circle cx="282" cy="76" r="14" fill="#55efc4" /><circle cx="282" cy="119" r="14" fill="#55efc4" /><path d="M108 75 H246" stroke="#fdcb6e" strokeWidth="4" /><path d="M246 75 l-11 -8 v16 z" fill="#fdcb6e" /><path d="M252 120 H114" stroke="#ff7675" strokeWidth="4" /><path d="M114 120 l11 -8 v16 z" fill="#ff7675" /><text x="140" y="61" fill="#fdcb6e" fontSize="11">forward rate</text><text x="140" y="142" fill="#ff7675" fontSize="11">reverse rate</text></Frame>;
  }

  if (/acid-base|buffer|titration|\bph\b/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="A weak-acid titration curve contains a buffer region and an equivalence point above pH 7.">{axes}<path d="M45 142 C120 137 180 128 205 105 C226 85 215 32 287 29 C305 28 317 28 326 27" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="217" y1="25" x2="217" y2="155" stroke="#fdcb6e" strokeDasharray="5 4" strokeWidth="2" /><text x="225" y="50" fill="#fdcb6e" fontSize="10">equivalence</text><text x="92" y="117" fill="#a29bfe" fontSize="10">buffer region</text><text x="7" y="30" fill="#b2bec3" fontSize="10">pH</text></Frame>;
  }

  if (/electrolytic|electrolysis|faraday/.test(text) && /chem|sci|sch/.test(course)) {
    return <Frame label="An external power source drives electron flow and a non-spontaneous redox reaction."><rect x="142" y="29" width="76" height="38" rx="7" fill="#161a25" stroke="#fdcb6e" strokeWidth="3" /><text x="162" y="53" fill="white" fontSize="12">power</text><path d="M142 48 H82 V92 M218 48 H278 V92" fill="none" stroke="#fdcb6e" strokeWidth="3" /><rect x="55" y="90" width="250" height="70" rx="10" fill="#172630" stroke="#55efc4" strokeWidth="2" /><line x1="82" y1="67" x2="82" y2="145" stroke="#a29bfe" strokeWidth="7" /><line x1="278" y1="67" x2="278" y2="145" stroke="#ff7675" strokeWidth="7" /><text x="66" y="178" fill="#a29bfe" fontSize="10">anode</text><text x="257" y="178" fill="#ff7675" fontSize="10">cathode</text></Frame>;
  }

  if (/projectile/.test(text) && /phy|phys|sp/.test(course)) {
    return <Frame label="Projectile motion separates horizontal velocity from vertical acceleration.">{axes}<path d="M52 132 Q168 18 305 132" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="75" y1="132" x2="75" y2="90" stroke="#a29bfe" strokeWidth="3" /><line x1="75" y1="132" x2="120" y2="132" stroke="#a29bfe" strokeWidth="3" /><text x="126" y="145" fill="#a29bfe" fontSize="11">vₓ constant</text><text x="83" y="87" fill="#a29bfe" fontSize="11">vᵧ</text><text x="252" y="62" fill="#ff7675" fontSize="11">aᵧ = −g</text></Frame>;
  }

  if (/force|newton|motion|friction|tension|free-body|kinematic/.test(text) && /phy|phys|sp/.test(course)) {
    return <Frame label="A free-body diagram isolates the forces acting on one object."><rect x="135" y="97" width="80" height="42" rx="6" fill="#6c5ce7" /><line x1="175" y1="97" x2="175" y2="45" stroke="#55efc4" strokeWidth="4" /><line x1="175" y1="139" x2="175" y2="170" stroke="#ff7675" strokeWidth="4" /><line x1="215" y1="118" x2="292" y2="118" stroke="#fdcb6e" strokeWidth="4" /><text x="184" y="57" fill="#55efc4" fontSize="11">normal</text><text x="184" y="166" fill="#ff7675" fontSize="11">weight</text><text x="244" y="109" fill="#fdcb6e" fontSize="11">applied</text></Frame>;
  }

  if (/condition|boolean|control flow|loop|iteration/.test(text) && /cs|ece|cp|geng|program/.test(course)) {
    return <Frame label="Control flow evaluates a condition and follows exactly one branch."><path d="M180 35 l62 43 -62 43 -62 -43 z" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><text x="153" y="82" fill="white" fontSize="11">condition?</text><path d="M118 78 H58 V145 H145" fill="none" stroke="#55efc4" strokeWidth="3" /><path d="M242 78 H302 V145 H215" fill="none" stroke="#ff7675" strokeWidth="3" /><text x="58" y="68" fill="#55efc4" fontSize="11">true</text><text x="276" y="68" fill="#ff7675" fontSize="11">false</text><rect x="83" y="135" width="62" height="28" rx="7" fill="#16352f" /><rect x="215" y="135" width="62" height="28" rx="7" fill="#3b2026" /></Frame>;
  }

  if (/recursion|recursive/.test(text) && /cs|ece|cp|geng|program/.test(course)) {
    return <Frame label="Structural recursion reduces the input until it reaches a base case."><rect x="35" y="48" width="78" height="34" rx="8" fill="#161a25" stroke="#a29bfe" strokeWidth="2" /><rect x="141" y="78" width="78" height="34" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="2" /><rect x="247" y="108" width="78" height="34" rx="8" fill="#161a25" stroke="#fdcb6e" strokeWidth="2" /><path d="M113 65 L141 87" stroke="#b2bec3" strokeWidth="3" /><path d="M219 95 L247 117" stroke="#b2bec3" strokeWidth="3" /><text x="51" y="69" fill="white" fontSize="11">list</text><text x="155" y="99" fill="white" fontSize="11">rest</text><text x="261" y="129" fill="white" fontSize="11">empty</text><text x="242" y="163" fill="#fdcb6e" fontSize="11">base case</text></Frame>;
  }

  if (/array|list|collection|search|sort|traversal|aggregation/.test(text) && /cs|ece|cp|geng|program/.test(course)) {
    return <Frame label="A collection stores ordered values; traversal visits each index systematically.">{[0, 1, 2, 3, 4].map((index) => <g key={index}><rect x={43 + (index * 55)} y="72" width="48" height="48" rx="5" fill={index === 2 ? '#21483f' : '#161a25'} stroke={index === 2 ? '#55efc4' : '#697386'} strokeWidth="2" /><text x={62 + (index * 55)} y="101" fill="white" fontSize="13">{[8, 3, 9, 2, 6][index]}</text><text x={62 + (index * 55)} y="140" fill="#697386" fontSize="10">{index}</text></g>)}<path d="M120 48 H200" stroke="#fdcb6e" strokeWidth="3" /><path d="M200 48 l-10 -7 v14 z" fill="#fdcb6e" /><text x="132" y="38" fill="#fdcb6e" fontSize="11">visit next</text></Frame>;
  }

  if (/transfer function|block diagram|controller|pid|feedback|system modelling|linearization/.test(text) && /aer372|control/.test(course)) {
    return <Frame label="A feedback loop compares the reference with the measured output."><circle cx="82" cy="92" r="18" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><rect x="130" y="68" width="74" height="48" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><rect x="246" y="68" width="74" height="48" rx="8" fill="#161a25" stroke="#fdcb6e" strokeWidth="3" /><path d="M22 92 H64 M100 92 H130 M204 92 H246 M320 92 H342" stroke="#b2bec3" strokeWidth="3" /><path d="M330 92 V151 H82 V110" fill="none" stroke="#ff7675" strokeWidth="2" /><text x="145" y="97" fill="white" fontSize="11">controller</text><text x="267" y="97" fill="white" fontSize="11">plant</text><text x="70" y="97" fill="white" fontSize="12">Σ</text><text x="170" y="169" fill="#ff7675" fontSize="10">measured feedback</text></Frame>;
  }

  if (/step response|transient|stability|root locus|bode|frequency/.test(text) && /aer372|control/.test(course)) {
    return <Frame label="A stable response approaches its target while transient error decays.">{axes}<line x1="38" y1="67" x2="330" y2="67" stroke="#697386" strokeDasharray="6 5" strokeWidth="2" /><path d="M40 150 C72 148 75 28 112 58 S154 84 180 65 S220 60 245 68 S288 66 328 67" fill="none" stroke="#55efc4" strokeWidth="4" /><text x="270" y="57" fill="#b2bec3" fontSize="11">target</text><text x="95" y="29" fill="#fdcb6e" fontSize="11">overshoot</text></Frame>;
  }

  if (/markov|transition|state/.test(text) && /act/.test(course)) {
    return <Frame label="A Markov chain moves between states according to transition probabilities."><circle cx="88" cy="96" r="34" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><circle cx="272" cy="96" r="34" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M122 82 C164 48 210 48 238 82" fill="none" stroke="#fdcb6e" strokeWidth="3" /><path d="M238 110 C204 144 158 144 122 110" fill="none" stroke="#ff7675" strokeWidth="3" /><text x="75" y="101" fill="white" fontSize="12">S₁</text><text x="259" y="101" fill="white" fontSize="12">S₂</text><text x="172" y="54" fill="#fdcb6e" fontSize="11">p₁₂</text><text x="172" y="146" fill="#ff7675" fontSize="11">p₂₁</text></Frame>;
  }

  if (/poisson|waiting time|counting process|renewal|queue/.test(text) && /act/.test(course)) {
    return <Frame label="A counting process records random arrivals along a continuous timeline."><line x1="35" y1="105" x2="328" y2="105" stroke="#697386" strokeWidth="3" />{[74, 126, 211, 246, 302].map((x, index) => <g key={x}><line x1={x} y1="84" x2={x} y2="126" stroke="#55efc4" strokeWidth="3" /><circle cx={x} cy="84" r="5" fill="#fdcb6e" /><text x={x - 4} y="145" fill="#b2bec3" fontSize="10">{index + 1}</text></g>)}<text x="37" y="69" fill="#a29bfe" fontSize="11">random interarrival times</text><text x="300" y="123" fill="#b2bec3" fontSize="11">t</text></Frame>;
  }

  if (/curve|curvature|torsion|frenet|arc length/.test(text) && /mat307|geometry/.test(course)) {
    return <Frame label="A curve's tangent and normal frame tracks how its direction changes."><path d="M40 135 C92 126 116 48 191 65 S275 140 325 62" fill="none" stroke="#a29bfe" strokeWidth="4" /><circle cx="191" cy="65" r="5" fill="#fdcb6e" /><line x1="150" y1="54" x2="242" y2="78" stroke="#55efc4" strokeWidth="3" /><line x1="191" y1="65" x2="175" y2="123" stroke="#ff7675" strokeWidth="3" /><text x="235" y="68" fill="#55efc4" fontSize="12">T</text><text x="164" y="137" fill="#ff7675" fontSize="12">N</text></Frame>;
  }

  if (/surface|tangent plane|gaussian|mean curvature|geodesic/.test(text) && /mat307|geometry/.test(course)) {
    return <Frame label="A tangent plane gives the best local linear model of a curved surface."><path d="M55 130 Q180 35 305 130 Q180 172 55 130" fill="#171f2c" stroke="#a29bfe" strokeWidth="3" /><path d="M105 112 L235 72 L277 120 L147 158 Z" fill="#55efc4" fillOpacity="0.22" stroke="#55efc4" strokeWidth="2" /><line x1="190" y1="109" x2="190" y2="35" stroke="#fdcb6e" strokeWidth="3" /><text x="199" y="43" fill="#fdcb6e" fontSize="11">normal</text><text x="219" y="91" fill="#55efc4" fontSize="11">tangent plane</text></Frame>;
  }

  if (/regression|correlation|scatter|residual/.test(text) && /mdm|stat|data/.test(course)) {
    return <Frame label="A regression line summarizes a trend; residuals measure vertical prediction errors.">{axes}{[[65,132],[92,120],[121,126],[151,96],[181,104],[214,76],[248,83],[280,53],[312,61]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#55efc4" />)}<line x1="55" y1="138" x2="320" y2="48" stroke="#a29bfe" strokeWidth="3" /><line x1="181" y1="104" x2="181" y2="95" stroke="#ff7675" strokeWidth="3" /><text x="188" y="112" fill="#ff7675" fontSize="10">residual</text></Frame>;
  }

  if (/normal distribution|z-score|distribution/.test(text) && /mdm|stat|act/.test(course)) {
    return <Frame label="A normal distribution is centred at its mean; a z-score measures standard deviations from it.">{axes}<path d="M45 151 C100 150 122 134 151 72 C164 43 196 43 209 72 C238 134 260 150 325 151" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="180" y1="48" x2="180" y2="155" stroke="#fdcb6e" strokeDasharray="5 4" strokeWidth="2" /><text x="169" y="174" fill="#fdcb6e" fontSize="11">μ</text></Frame>;
  }

  if (/enzyme|protein/.test(text) && /bio|sbi|life/.test(course)) {
    return <Frame label="An enzyme's active site binds a compatible substrate and lowers activation energy."><path d="M82 56 C45 78 54 139 102 145 C136 149 160 130 158 102 C139 114 113 112 105 91 C97 74 107 61 121 48 C107 43 94 47 82 56 Z" fill="#6c5ce7" /><path d="M213 63 l35 21 -22 37 -34 -20 z" fill="#55efc4" /><path d="M166 96 H198" stroke="#fdcb6e" strokeWidth="3" /><path d="M198 96 l-10 -7 v14 z" fill="#fdcb6e" /><text x="63" y="169" fill="#b2bec3" fontSize="11">enzyme</text><text x="205" y="145" fill="#b2bec3" fontSize="11">substrate</text></Frame>;
  }

  if (/homeostasis|feedback|hormone|blood glucose/.test(text) && /bio|sbi|life/.test(course)) {
    return <Frame label="Negative feedback detects deviation and acts to restore a set point."><circle cx="180" cy="92" r="30" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M180 32 C270 30 315 78 285 137" fill="none" stroke="#a29bfe" strokeWidth="3" /><path d="M285 137 l-2 -14 -12 7 z" fill="#a29bfe" /><path d="M270 145 C185 182 79 154 68 85" fill="none" stroke="#fdcb6e" strokeWidth="3" /><path d="M68 85 l-7 13 14 1 z" fill="#fdcb6e" /><path d="M75 72 C100 34 130 31 180 32" fill="none" stroke="#ff7675" strokeWidth="3" /><text x="158" y="97" fill="white" fontSize="11">set point</text><text x="263" y="61" fill="#a29bfe" fontSize="10">response</text><text x="89" y="157" fill="#fdcb6e" fontSize="10">correction</text></Frame>;
  }

  if (/fluid|velocity field|streamline|pathline|material derivative|continuum/.test(text) && /aer210|fluid/.test(course)) {
    return <Frame label="A velocity field assigns a flow vector to every point in space and time.">{[55, 110, 165, 220, 275].map((x, column) => [55, 95, 135].map((y, row) => <g key={`${x}-${y}`}><line x1={x} y1={y} x2={x + 25 + (column * 3)} y2={y - 8 + (row * 3)} stroke="#55efc4" strokeWidth="3" /><path d={`M${x + 25 + (column * 3)} ${y - 8 + (row * 3)} l-9 -3 3 8 z`} fill="#55efc4" /></g>))}<text x="105" y="174" fill="#b2bec3" fontSize="11">u(x, y, t) describes local flow</text></Frame>;
  }

  if (/bernoulli|conservation of mass|momentum balance|hydrostatic|viscosity|laminar/.test(text) && /aer210|fluid/.test(course)) {
    return <Frame label="Conservation links flow conditions across a changing streamtube."><path d="M35 58 C125 67 218 49 325 35 L325 150 C218 136 125 117 35 128 Z" fill="#172630" stroke="#55efc4" strokeWidth="3" /><line x1="92" y1="64" x2="92" y2="122" stroke="#a29bfe" strokeWidth="3" /><line x1="270" y1="43" x2="270" y2="143" stroke="#fdcb6e" strokeWidth="3" /><path d="M116 95 H242" stroke="#55efc4" strokeWidth="4" /><path d="M242 95 l-11 -8 v16 z" fill="#55efc4" /><text x="68" y="148" fill="#a29bfe" fontSize="11">section 1</text><text x="248" y="166" fill="#fdcb6e" fontSize="11">section 2</text></Frame>;
  }

  if (/orbit|two-body|orbital element|transfer maneuver|central-force/.test(text) && /aer301|dynamics/.test(course)) {
    return <Frame label="An orbit is a conic path governed by gravity toward a focus."><ellipse cx="180" cy="96" rx="132" ry="60" fill="none" stroke="#a29bfe" strokeWidth="3" /><circle cx="125" cy="96" r="14" fill="#fdcb6e" /><circle cx="286" cy="67" r="7" fill="#55efc4" /><path d="M286 67 l-28 -16" stroke="#55efc4" strokeWidth="3" /><text x="93" y="123" fill="#fdcb6e" fontSize="11">focus</text><text x="266" y="43" fill="#55efc4" fontSize="11">velocity</text></Frame>;
  }

  if (/vibration|oscillation|small oscillation/.test(text) && /aer301|dynamics/.test(course)) {
    return <Frame label="A mass-spring model converts displacement into a restoring force."><rect x="34" y="35" width="18" height="118" fill="#697386" /><path d="M52 94 l22 -20 22 40 22 -40 22 40 22 -40 22 20" fill="none" stroke="#a29bfe" strokeWidth="4" /><rect x="184" y="67" width="74" height="56" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M258 95 H318" stroke="#fdcb6e" strokeWidth="3" /><path d="M318 95 l-11 -8 v16 z" fill="#fdcb6e" /><text x="207" y="100" fill="white" fontSize="12">m</text><text x="279" y="83" fill="#fdcb6e" fontSize="11">x(t)</text><text x="102" y="145" fill="#a29bfe" fontSize="11">spring k</text></Frame>;
  }

  // Course-aware fallback visuals. These are intentionally compact so the
  // diagram never becomes a second paragraph of text.
  if (/phy|phys|sp|aer210|aer301/.test(course)) {
    return <Frame label="Physics model: system → variables → governing relationship."><circle cx="180" cy="95" r="38" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><line x1="65" y1="95" x2="142" y2="95" stroke="#a29bfe" strokeWidth="3" /><path d="M142 95 l-11 -7 v14 z" fill="#a29bfe" /><line x1="218" y1="95" x2="295" y2="95" stroke="#fdcb6e" strokeWidth="3" /><path d="M295 95 l-11 -7 v14 z" fill="#fdcb6e" /><text x="48" y="76" fill="#b2bec3" fontSize="11">given</text><text x="165" y="101" fill="#fff" fontSize="11">model</text><text x="302" y="76" fill="#b2bec3" fontSize="11">result</text></Frame>;
  }

  if (/chem|sci|sch/.test(course)) {
    return <Frame label="Chemistry model: particles rearrange under conserved constraints."><circle cx="115" cy="78" r="15" fill="#a29bfe" /><circle cx="143" cy="112" r="11" fill="#55efc4" /><circle cx="238" cy="88" r="15" fill="#55efc4" /><circle cx="262" cy="118" r="11" fill="#a29bfe" /><path d="M167 96 H205" stroke="#fdcb6e" strokeWidth="3" /><path d="M205 96 l-10 -7 v14 z" fill="#fdcb6e" /><text x="105" y="158" fill="#b2bec3" fontSize="11">reactants</text><text x="229" y="158" fill="#b2bec3" fontSize="11">products</text></Frame>;
  }

  if (/bio|sbi|life|cell|dna|protein/.test(course)) {
    return <Frame label="Biology model: structure → mechanism → observable outcome."><rect x="35" y="76" width="78" height="38" rx="12" fill="#161a25" stroke="#55efc4" strokeWidth="2" /><rect x="141" y="76" width="78" height="38" rx="12" fill="#161a25" stroke="#a29bfe" strokeWidth="2" /><rect x="247" y="76" width="78" height="38" rx="12" fill="#161a25" stroke="#fdcb6e" strokeWidth="2" /><path d="M113 95 H141" stroke="#b2bec3" strokeWidth="3" /><path d="M219 95 H247" stroke="#b2bec3" strokeWidth="3" /><text x="56" y="100" fill="#fff" fontSize="11">structure</text><text x="158" y="100" fill="#fff" fontSize="11">mechanism</text><text x="262" y="100" fill="#fff" fontSize="11">outcome</text></Frame>;
  }

  if (/cs|ece|cp|geng|program|algorithm|data/.test(course)) {
    return <Frame label="Computing model: input → transformation → output."><rect x="35" y="74" width="76" height="42" rx="8" fill="#161a25" stroke="#a29bfe" strokeWidth="2" /><rect x="142" y="74" width="76" height="42" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="2" /><rect x="249" y="74" width="76" height="42" rx="8" fill="#161a25" stroke="#fdcb6e" strokeWidth="2" /><path d="M111 95 H142" stroke="#b2bec3" strokeWidth="3" /><path d="M218 95 H249" stroke="#b2bec3" strokeWidth="3" /><text x="52" y="100" fill="#fff" fontSize="11">input</text><text x="157" y="100" fill="#fff" fontSize="11">logic</text><text x="265" y="100" fill="#fff" fontSize="11">output</text></Frame>;
  }

  return <Frame label="Lesson model: identify the givens, apply the key idea, then verify the result."><circle cx="88" cy="95" r="26" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><circle cx="180" cy="95" r="26" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><circle cx="272" cy="95" r="26" fill="#161a25" stroke="#fdcb6e" strokeWidth="3" /><path d="M114 95 H154" stroke="#b2bec3" strokeWidth="3" /><path d="M206 95 H246" stroke="#b2bec3" strokeWidth="3" /><text x="76" y="99" fill="#fff" fontSize="10">given</text><text x="166" y="99" fill="#fff" fontSize="10">apply</text><text x="260" y="99" fill="#fff" fontSize="10">check</text></Frame>;
}
