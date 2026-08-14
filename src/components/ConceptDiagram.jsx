import { useId } from 'react';
import { DIAGRAM_LABELS, getConceptDiagramType } from './conceptDiagramSelection.js';

function Frame({ children, label, accent = '#a29bfe' }) {
  const titleId = useId();
  return (
    <figure className="concept-visual rounded-xl border border-white/[0.08] bg-[#0b0d13] p-3">
      <svg viewBox="0 0 360 190" className="w-full max-w-xl mx-auto block h-auto" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{label}</title>
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
  const diagramType = getConceptDiagramType({ courseCode, label, snippet });
  if (!diagramType) return null;

  // Prefer lesson-specific visuals. The course-aware fallbacks below prevent a
  // keyword such as "energy" in chemistry from accidentally selecting physics.
  if (diagramType === 'average-rate') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 138 C108 132 142 88 205 68 S286 42 325 33" fill="none" stroke="#a29bfe" strokeWidth="4" /><line x1="82" y1="126" x2="260" y2="50" stroke="#55efc4" strokeWidth="3" /><circle cx="82" cy="126" r="5" fill="#fdcb6e" /><circle cx="260" cy="50" r="5" fill="#fdcb6e" /><text x="104" y="83" fill="#55efc4" fontSize="13">secant</text><text x="112" y="177" fill="#b2bec3" fontSize="11">Δy / Δx over an interval</text></Frame>;
  }

  if (diagramType === 'discontinuity') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 135 C90 112 130 105 177 84 S250 52 322 42" fill="none" stroke="#55efc4" strokeWidth="4" /><circle cx="205" cy="72" r="7" fill="#0b0d13" stroke="#ff7675" strokeWidth="3" /><text x="220" y="68" fill="#ff7675" fontSize="12">hole</text><text x="220" y="85" fill="#b2bec3" fontSize="11">lim f(x) exists</text></Frame>;
  }

  if (diagramType === 'derivative') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 140 C105 130 138 88 205 68 S290 40 325 32" fill="none" stroke="#a29bfe" strokeWidth="4" /><line x1="165" y1="100" x2="270" y2="30" stroke="#55efc4" strokeWidth="3" /><circle cx="205" cy="68" r="6" fill="#fdcb6e" /><text x="246" y="27" fill="#55efc4" fontSize="12">tangent</text><text x="161" y="178" fill="#b2bec3" fontSize="11">slope = f′(a) at x = a</text></Frame>;
  }

  if (diagramType === 'vectors') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<defs><marker id="vector-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#55efc4" /></marker><marker id="vector-arrow-secondary" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#a29bfe" /></marker></defs><line x1="35" y1="155" x2="250" y2="62" stroke="#55efc4" strokeWidth="4" markerEnd="url(#vector-arrow)" /><line x1="35" y1="155" x2="205" y2="125" stroke="#a29bfe" strokeWidth="4" markerEnd="url(#vector-arrow-secondary)" /><text x="257" y="61" fill="#55efc4" fontSize="13">v</text><text x="212" y="128" fill="#a29bfe" fontSize="13">u</text><text x="123" y="177" fill="#b2bec3" fontSize="11">x</text><text x="22" y="31" fill="#b2bec3" fontSize="11">y</text></Frame>;
  }

  if (diagramType === 'periodic-trends') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{[<circle key="1" cx="105" cy="95" r="51" fill="none" stroke="#a29bfe" strokeWidth="3" />, <circle key="2" cx="105" cy="95" r="18" fill="#6c5ce7" />, <circle key="3" cx="257" cy="95" r="35" fill="none" stroke="#55efc4" strokeWidth="3" />, <circle key="4" cx="257" cy="95" r="18" fill="#00cec9" />, <path key="5" d="M166 95 H202" stroke="#fdcb6e" strokeWidth="4" />, <path key="6" d="M202 95 l-11 -8 v16 z" fill="#fdcb6e" />, <text key="7" x="76" y="100" fill="white" fontSize="11">lower Z_eff</text>, <text key="8" x="226" y="100" fill="#0f1117" fontSize="11">higher Z_eff</text>] }<text x="84" y="174" fill="#b2bec3" fontSize="11">across one period: same valence shell</text></Frame>;
  }

  if (diagramType === 'galvanic') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><rect x="35" y="70" width="100" height="70" rx="8" fill="#1a1d27" stroke="#a29bfe" strokeWidth="2" /><rect x="225" y="70" width="100" height="70" rx="8" fill="#1a1d27" stroke="#55efc4" strokeWidth="2" /><line x1="96" y1="38" x2="264" y2="38" stroke="#fdcb6e" strokeWidth="4" /><path d="M264 38 l-12 -8 v16 z" fill="#fdcb6e" /><text x="49" y="95" fill="#a29bfe" fontSize="12">anode (−)</text><text x="49" y="113" fill="#b2bec3" fontSize="11">oxidation</text><text x="239" y="95" fill="#55efc4" fontSize="12">cathode (+)</text><text x="239" y="113" fill="#b2bec3" fontSize="11">reduction</text><text x="137" y="29" fill="#fdcb6e" fontSize="11">e− through wire</text><text x="125" y="162" fill="#b2bec3" fontSize="10">anions → anode; cations → cathode</text></Frame>;
  }

  if (diagramType === 'esterification') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><text x="18" y="82" fill="#a29bfe" fontSize="15">carboxylic acid</text><text x="146" y="82" fill="#b2bec3" fontSize="14">+</text><text x="168" y="82" fill="#55efc4" fontSize="15">alcohol</text><path d="M79 107 H280" stroke="#fdcb6e" strokeWidth="3" /><path d="M280 107 l-12 -8 v16 z" fill="#fdcb6e" /><path d="M280 117 H79" stroke="#fdcb6e" strokeWidth="3" /><path d="M79 117 l12 -8 v16 z" fill="#fdcb6e" /><text x="128" y="98" fill="#fdcb6e" fontSize="11">H⁺, heat</text><text x="75" y="150" fill="#55efc4" fontSize="15">ester + H₂O</text></Frame>;
  }

  if (diagramType === 'polarity') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><circle cx="100" cy="92" r="15" fill="#6c5ce7" /><circle cx="48" cy="92" r="12" fill="#55efc4" /><circle cx="152" cy="92" r="12" fill="#55efc4" /><line x1="60" y1="92" x2="85" y2="92" stroke="#b2bec3" strokeWidth="5" /><line x1="115" y1="92" x2="140" y2="92" stroke="#b2bec3" strokeWidth="5" /><path d="M78 64 H50 M122 64 H150" stroke="#fdcb6e" strokeWidth="3" /><path d="M50 64 l10 -7 v14 z M150 64 l-10 -7 v14 z" fill="#fdcb6e" /><text x="49" y="132" fill="#b2bec3" fontSize="10">linear: dipoles cancel</text><circle cx="260" cy="105" r="15" fill="#6c5ce7" /><circle cx="218" cy="62" r="12" fill="#55efc4" /><circle cx="302" cy="62" r="12" fill="#55efc4" /><line x1="249" y1="94" x2="227" y2="71" stroke="#b2bec3" strokeWidth="5" /><line x1="271" y1="94" x2="293" y2="71" stroke="#b2bec3" strokeWidth="5" /><path d="M260 87 V37" stroke="#fdcb6e" strokeWidth="3" /><path d="M260 37 l-8 12 h16 z" fill="#fdcb6e" /><text x="207" y="147" fill="#b2bec3" fontSize="10">bent: net dipole ≠ 0</text></Frame>;
  }

  if (diagramType === 'calorimetry') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M105 45 L120 151 H240 L255 45" fill="#172630" stroke="#a29bfe" strokeWidth="3" /><path d="M122 92 H238 L232 145 H128 Z" fill="#21483f" /><line x1="205" y1="30" x2="205" y2="126" stroke="#ff7675" strokeWidth="5" /><circle cx="205" cy="128" r="9" fill="#ff7675" /><path d="M152 83 C139 67 158 58 146 43 M180 83 C167 67 186 58 174 43" fill="none" stroke="#fdcb6e" strokeWidth="3" /><text x="106" y="174" fill="#b2bec3" fontSize="11">q_solution = mcΔT; q_rxn = −q_solution</text></Frame>;
  }

  if (diagramType === 'activation-energy') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 135 C92 133 110 38 176 36 S249 129 322 96" fill="none" stroke="#ff7675" strokeWidth="4" /><path d="M45 135 C105 132 125 73 178 72 S250 124 322 96" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="56" y1="135" x2="56" y2="36" stroke="#ff7675" strokeDasharray="4 4" /><line x1="68" y1="135" x2="68" y2="72" stroke="#55efc4" strokeDasharray="4 4" /><text x="77" y="50" fill="#ff7675" fontSize="10">larger Eₐ</text><text x="77" y="86" fill="#55efc4" fontSize="10">smaller Eₐ</text><text x="132" y="177" fill="#b2bec3" fontSize="10">reaction coordinate</text><text x="6" y="24" fill="#b2bec3" fontSize="10">energy</text></Frame>;
  }

  if (diagramType === 'equilibrium') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><circle cx="78" cy="76" r="14" fill="#a29bfe" /><circle cx="78" cy="119" r="14" fill="#a29bfe" /><circle cx="282" cy="76" r="14" fill="#55efc4" /><circle cx="282" cy="119" r="14" fill="#55efc4" /><path d="M108 75 H246" stroke="#fdcb6e" strokeWidth="4" /><path d="M246 75 l-11 -8 v16 z" fill="#fdcb6e" /><path d="M252 120 H114" stroke="#ff7675" strokeWidth="4" /><path d="M114 120 l11 -8 v16 z" fill="#ff7675" /><text x="128" y="61" fill="#fdcb6e" fontSize="11">forward rate = r</text><text x="128" y="142" fill="#ff7675" fontSize="11">reverse rate = r</text></Frame>;
  }

  if (diagramType === 'titration') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 142 C120 137 180 128 205 105 C226 85 215 32 287 29 C305 28 317 28 326 27" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="217" y1="25" x2="217" y2="155" stroke="#fdcb6e" strokeDasharray="5 4" strokeWidth="2" /><line x1="35" y1="90" x2="335" y2="90" stroke="#697386" strokeDasharray="3 5" /><text x="225" y="50" fill="#fdcb6e" fontSize="10">equivalence pH &gt; 7</text><text x="92" y="117" fill="#a29bfe" fontSize="10">buffer region</text><text x="7" y="30" fill="#b2bec3" fontSize="10">pH</text><text x="8" y="94" fill="#b2bec3" fontSize="10">7</text><text x="228" y="177" fill="#b2bec3" fontSize="10">base added (mL)</text></Frame>;
  }

  if (diagramType === 'electrolysis') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><rect x="142" y="29" width="76" height="38" rx="7" fill="#161a25" stroke="#fdcb6e" strokeWidth="3" /><text x="155" y="53" fill="white" fontSize="12">DC power</text><text x="145" y="25" fill="#fdcb6e" fontSize="12">+</text><text x="207" y="25" fill="#fdcb6e" fontSize="12">−</text><path d="M142 48 H82 V92 M218 48 H278 V92" fill="none" stroke="#fdcb6e" strokeWidth="3" /><rect x="55" y="90" width="250" height="70" rx="10" fill="#172630" stroke="#55efc4" strokeWidth="2" /><line x1="82" y1="67" x2="82" y2="145" stroke="#a29bfe" strokeWidth="7" /><line x1="278" y1="67" x2="278" y2="145" stroke="#ff7675" strokeWidth="7" /><text x="48" y="178" fill="#a29bfe" fontSize="10">anode (+): oxidation</text><text x="231" y="178" fill="#ff7675" fontSize="10">cathode (−): reduction</text></Frame>;
  }

  if (diagramType === 'projectile') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M52 132 Q168 18 305 132" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="75" y1="132" x2="75" y2="90" stroke="#a29bfe" strokeWidth="3" /><path d="M75 90 l-7 11 h14 z" fill="#a29bfe" /><line x1="75" y1="132" x2="120" y2="132" stroke="#a29bfe" strokeWidth="3" /><path d="M120 132 l-11 -7 v14 z" fill="#a29bfe" /><text x="126" y="145" fill="#a29bfe" fontSize="11">vₓ constant</text><text x="83" y="87" fill="#a29bfe" fontSize="11">vᵧ changes</text><text x="252" y="62" fill="#ff7675" fontSize="11">aᵧ = −g ≈ −9.81 m/s²</text></Frame>;
  }

  if (diagramType === 'free-body') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><rect x="135" y="97" width="80" height="42" rx="6" fill="#6c5ce7" /><line x1="175" y1="97" x2="175" y2="45" stroke="#55efc4" strokeWidth="4" /><path d="M175 45 l-8 12 h16 z" fill="#55efc4" /><line x1="175" y1="139" x2="175" y2="174" stroke="#ff7675" strokeWidth="4" /><path d="M175 174 l-8 -12 h16 z" fill="#ff7675" /><line x1="215" y1="118" x2="292" y2="118" stroke="#fdcb6e" strokeWidth="4" /><path d="M292 118 l-12 -8 v16 z" fill="#fdcb6e" /><line x1="135" y1="118" x2="77" y2="118" stroke="#a29bfe" strokeWidth="4" /><path d="M77 118 l12 -8 v16 z" fill="#a29bfe" /><text x="184" y="57" fill="#55efc4" fontSize="11">F_N</text><text x="184" y="168" fill="#ff7675" fontSize="11">F_g = mg</text><text x="244" y="109" fill="#fdcb6e" fontSize="11">F_applied</text><text x="68" y="108" fill="#a29bfe" fontSize="11">F_friction</text></Frame>;
  }

  if (diagramType === 'control-flow') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M180 35 l62 43 -62 43 -62 -43 z" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><text x="153" y="82" fill="white" fontSize="11">condition?</text><path d="M118 78 H58 V145 H145" fill="none" stroke="#55efc4" strokeWidth="3" /><path d="M242 78 H302 V145 H215" fill="none" stroke="#ff7675" strokeWidth="3" /><text x="58" y="68" fill="#55efc4" fontSize="11">true</text><text x="276" y="68" fill="#ff7675" fontSize="11">false</text><rect x="83" y="135" width="62" height="28" rx="7" fill="#16352f" /><rect x="215" y="135" width="62" height="28" rx="7" fill="#3b2026" /><text x="98" y="153" fill="white" fontSize="10">branch A</text><text x="230" y="153" fill="white" fontSize="10">branch B</text></Frame>;
  }

  if (diagramType === 'recursion') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><rect x="35" y="48" width="78" height="34" rx="8" fill="#161a25" stroke="#a29bfe" strokeWidth="2" /><rect x="141" y="78" width="78" height="34" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="2" /><rect x="247" y="108" width="78" height="34" rx="8" fill="#161a25" stroke="#fdcb6e" strokeWidth="2" /><path d="M113 65 L141 87" stroke="#b2bec3" strokeWidth="3" /><path d="M219 95 L247 117" stroke="#b2bec3" strokeWidth="3" /><text x="51" y="69" fill="white" fontSize="11">list</text><text x="155" y="99" fill="white" fontSize="11">rest</text><text x="261" y="129" fill="white" fontSize="11">empty</text><text x="242" y="163" fill="#fdcb6e" fontSize="11">base case</text></Frame>;
  }

  if (diagramType === 'collection') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{[0, 1, 2, 3, 4].map((index) => <g key={index}><rect x={43 + (index * 55)} y="72" width="48" height="48" rx="5" fill={index === 2 ? '#21483f' : '#161a25'} stroke={index === 2 ? '#55efc4' : '#697386'} strokeWidth="2" /><text x={62 + (index * 55)} y="101" fill="white" fontSize="13">{[8, 3, 9, 2, 6][index]}</text><text x={62 + (index * 55)} y="140" fill="#697386" fontSize="10">{index}</text></g>)}<path d="M120 48 H200" stroke="#fdcb6e" strokeWidth="3" /><path d="M200 48 l-10 -7 v14 z" fill="#fdcb6e" /><text x="132" y="38" fill="#fdcb6e" fontSize="11">visit next</text><text x="24" y="140" fill="#b2bec3" fontSize="10">index</text></Frame>;
  }

  if (diagramType === 'feedback-control') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><circle cx="82" cy="92" r="18" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><rect x="130" y="68" width="74" height="48" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><rect x="246" y="68" width="74" height="48" rx="8" fill="#161a25" stroke="#fdcb6e" strokeWidth="3" /><path d="M22 92 H64 M100 92 H130 M204 92 H246 M320 92 H342" stroke="#b2bec3" strokeWidth="3" /><path d="M330 92 V151 H82 V110" fill="none" stroke="#ff7675" strokeWidth="2" /><text x="145" y="97" fill="white" fontSize="11">controller</text><text x="267" y="97" fill="white" fontSize="11">plant</text><text x="70" y="97" fill="white" fontSize="12">Σ</text><text x="59" y="122" fill="#ff7675" fontSize="12">−</text><text x="170" y="169" fill="#ff7675" fontSize="10">measured output feedback</text></Frame>;
  }

  if (diagramType === 'stable-response') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<line x1="38" y1="67" x2="330" y2="67" stroke="#697386" strokeDasharray="6 5" strokeWidth="2" /><path d="M40 150 C72 148 75 28 112 58 S154 84 180 65 S220 60 245 68 S288 66 328 67" fill="none" stroke="#55efc4" strokeWidth="4" /><text x="270" y="57" fill="#b2bec3" fontSize="11">unit-step target</text><text x="95" y="29" fill="#fdcb6e" fontSize="11">overshoot</text><text x="300" y="175" fill="#b2bec3" fontSize="10">time</text><text x="8" y="29" fill="#b2bec3" fontSize="10">output</text></Frame>;
  }

  if (diagramType === 'markov') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><circle cx="88" cy="96" r="34" fill="#161a25" stroke="#a29bfe" strokeWidth="3" /><circle cx="272" cy="96" r="34" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M122 82 C164 48 210 48 238 82" fill="none" stroke="#fdcb6e" strokeWidth="3" /><path d="M238 82 l-13 -2 7 11 z" fill="#fdcb6e" /><path d="M238 110 C204 144 158 144 122 110" fill="none" stroke="#ff7675" strokeWidth="3" /><path d="M122 110 l13 2 -7 -11 z" fill="#ff7675" /><text x="75" y="101" fill="white" fontSize="12">S₁</text><text x="259" y="101" fill="white" fontSize="12">S₂</text><text x="172" y="54" fill="#fdcb6e" fontSize="11">p₁₂</text><text x="172" y="146" fill="#ff7675" fontSize="11">p₂₁</text><text x="119" y="174" fill="#b2bec3" fontSize="10">each state's outgoing probabilities sum to 1</text></Frame>;
  }

  if (diagramType === 'counting-process') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><line x1="35" y1="105" x2="328" y2="105" stroke="#697386" strokeWidth="3" />{[74, 126, 211, 246, 302].map((x, index) => <g key={x}><line x1={x} y1="84" x2={x} y2="126" stroke="#55efc4" strokeWidth="3" /><circle cx={x} cy="84" r="5" fill="#fdcb6e" /><text x={x - 8} y="145" fill="#b2bec3" fontSize="10">N={index + 1}</text></g>)}<text x="37" y="69" fill="#a29bfe" fontSize="11">unequal interarrival times</text><text x="300" y="123" fill="#b2bec3" fontSize="11">time t</text></Frame>;
  }

  if (diagramType === 'curve-frame') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M40 135 C92 126 116 48 191 65 S275 140 325 62" fill="none" stroke="#a29bfe" strokeWidth="4" /><circle cx="191" cy="65" r="5" fill="#fdcb6e" /><line x1="150" y1="54" x2="242" y2="78" stroke="#55efc4" strokeWidth="3" /><path d="M242 78 l-11 -9 -3 12 z" fill="#55efc4" /><line x1="191" y1="65" x2="176" y2="123" stroke="#ff7675" strokeWidth="3" /><path d="M176 123 l-4 -13 12 3 z" fill="#ff7675" /><text x="235" y="68" fill="#55efc4" fontSize="12">unit T</text><text x="164" y="137" fill="#ff7675" fontSize="12">unit N</text></Frame>;
  }

  if (diagramType === 'tangent-plane') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M55 130 Q180 35 305 130 Q180 172 55 130" fill="#171f2c" stroke="#a29bfe" strokeWidth="3" /><path d="M105 112 L235 72 L277 120 L147 158 Z" fill="#55efc4" fillOpacity="0.22" stroke="#55efc4" strokeWidth="2" /><circle cx="190" cy="109" r="4" fill="#fff" /><line x1="190" y1="109" x2="190" y2="35" stroke="#fdcb6e" strokeWidth="3" /><path d="M190 35 l-7 12 h14 z" fill="#fdcb6e" /><text x="199" y="43" fill="#fdcb6e" fontSize="11">normal n</text><text x="219" y="91" fill="#55efc4" fontSize="11">tangent plane at p</text></Frame>;
  }

  if (diagramType === 'regression') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}{[[65,132],[92,120],[121,126],[151,96],[181,104],[214,76],[248,83],[280,53],[312,61]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#55efc4" />)}<line x1="55" y1="138" x2="320" y2="48" stroke="#a29bfe" strokeWidth="3" /><line x1="181" y1="104" x2="181" y2="95" stroke="#ff7675" strokeWidth="3" /><text x="188" y="112" fill="#ff7675" fontSize="10">e = y − ŷ</text><text x="311" y="173" fill="#b2bec3" fontSize="10">x</text><text x="18" y="30" fill="#b2bec3" fontSize="10">y</text></Frame>;
  }

  if (diagramType === 'normal') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{axes}<path d="M45 151 C100 150 122 134 151 72 C164 43 196 43 209 72 C238 134 260 150 325 151" fill="none" stroke="#55efc4" strokeWidth="4" /><line x1="180" y1="48" x2="180" y2="155" stroke="#fdcb6e" strokeDasharray="5 4" strokeWidth="2" /><text x="169" y="174" fill="#fdcb6e" fontSize="11">μ</text><text x="231" y="174" fill="#b2bec3" fontSize="10">μ + σ</text><text x="289" y="174" fill="#b2bec3" fontSize="10">x</text><text x="5" y="29" fill="#b2bec3" fontSize="10">density</text></Frame>;
  }

  if (diagramType === 'enzyme') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M82 56 C45 78 54 139 102 145 C136 149 160 130 158 102 C139 114 113 112 105 91 C97 74 107 61 121 48 C107 43 94 47 82 56 Z" fill="#6c5ce7" /><path d="M213 63 l35 21 -22 37 -34 -20 z" fill="#55efc4" /><path d="M166 96 H198" stroke="#fdcb6e" strokeWidth="3" /><path d="M198 96 l-10 -7 v14 z" fill="#fdcb6e" /><text x="63" y="169" fill="#b2bec3" fontSize="11">enzyme + active site</text><text x="205" y="145" fill="#b2bec3" fontSize="11">substrate</text></Frame>;
  }

  if (diagramType === 'homeostasis') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><circle cx="180" cy="92" r="30" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M180 32 C270 30 315 78 285 137" fill="none" stroke="#a29bfe" strokeWidth="3" /><path d="M285 137 l-2 -14 -12 7 z" fill="#a29bfe" /><path d="M270 145 C185 182 79 154 68 85" fill="none" stroke="#fdcb6e" strokeWidth="3" /><path d="M68 85 l-7 13 14 1 z" fill="#fdcb6e" /><path d="M75 72 C100 34 130 31 180 32" fill="none" stroke="#ff7675" strokeWidth="3" /><text x="158" y="97" fill="white" fontSize="11">set point</text><text x="250" y="61" fill="#a29bfe" fontSize="10">effector response</text><text x="89" y="157" fill="#fdcb6e" fontSize="10">reduced deviation</text><text x="76" y="57" fill="#ff7675" fontSize="10">sensor detects change</text></Frame>;
  }

  if (diagramType === 'velocity-field') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}>{[55, 110, 165, 220, 275].map((x, column) => [55, 95, 135].map((y, row) => <g key={`${x}-${y}`}><line x1={x} y1={y} x2={x + 25 + (column * 3)} y2={y - 8 + (row * 3)} stroke="#55efc4" strokeWidth="3" /><path d={`M${x + 25 + (column * 3)} ${y - 8 + (row * 3)} l-9 -3 3 8 z`} fill="#55efc4" /></g>))}<text x="92" y="174" fill="#b2bec3" fontSize="11">u(x, y, t): local velocity [m/s]</text></Frame>;
  }

  if (diagramType === 'streamtube') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><path d="M35 58 C125 67 218 49 325 35 L325 150 C218 136 125 117 35 128 Z" fill="#172630" stroke="#55efc4" strokeWidth="3" /><line x1="92" y1="64" x2="92" y2="122" stroke="#a29bfe" strokeWidth="3" /><line x1="270" y1="43" x2="270" y2="143" stroke="#fdcb6e" strokeWidth="3" /><path d="M116 95 H242" stroke="#55efc4" strokeWidth="4" /><path d="M242 95 l-11 -8 v16 z" fill="#55efc4" /><text x="68" y="148" fill="#a29bfe" fontSize="11">section 1: A₁, v₁</text><text x="238" y="166" fill="#fdcb6e" fontSize="11">section 2: A₂, v₂</text><text x="114" y="32" fill="#b2bec3" fontSize="10">incompressible: A₁v₁ = A₂v₂</text></Frame>;
  }

  if (diagramType === 'orbit') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><ellipse cx="180" cy="96" rx="132" ry="60" fill="none" stroke="#a29bfe" strokeWidth="3" /><circle cx="125" cy="96" r="14" fill="#fdcb6e" /><circle cx="286" cy="67" r="7" fill="#55efc4" /><path d="M286 67 l25 15" stroke="#55efc4" strokeWidth="3" /><path d="M311 82 l-13 -1 6 -10 z" fill="#55efc4" /><path d="M280 72 L137 96" stroke="#ff7675" strokeDasharray="4 4" strokeWidth="2" /><text x="93" y="123" fill="#fdcb6e" fontSize="11">attracting focus</text><text x="292" y="62" fill="#55efc4" fontSize="11">tangent velocity</text><text x="189" y="75" fill="#ff7675" fontSize="10">gravity inward</text></Frame>;
  }

  if (diagramType === 'oscillator') {
    return <Frame label={DIAGRAM_LABELS[diagramType]}><rect x="34" y="35" width="18" height="118" fill="#697386" /><path d="M52 94 l22 -20 22 40 22 -40 22 40 22 -40 22 20" fill="none" stroke="#a29bfe" strokeWidth="4" /><rect x="184" y="67" width="74" height="56" rx="8" fill="#161a25" stroke="#55efc4" strokeWidth="3" /><path d="M258 95 H318" stroke="#fdcb6e" strokeWidth="3" /><path d="M318 95 l-11 -8 v16 z" fill="#fdcb6e" /><path d="M184 112 H140" stroke="#ff7675" strokeWidth="3" /><path d="M140 112 l11 -8 v16 z" fill="#ff7675" /><text x="207" y="100" fill="white" fontSize="12">m</text><text x="279" y="83" fill="#fdcb6e" fontSize="11">+x(t)</text><text x="92" y="145" fill="#a29bfe" fontSize="11">spring constant k [N/m]</text><text x="132" y="132" fill="#ff7675" fontSize="11">Fₛ = −kx</text></Frame>;
  }

  return null;
}
