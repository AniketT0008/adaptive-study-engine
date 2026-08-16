import MathText from './MathText.jsx';

const PLANE_CASES = [
  ['All three coincide', 'rank(A) = rank([A|b]) = 1', 'Infinitely many common points: the three equations describe the same plane.'],
  ['Two coincide; third cuts them', 'rank(A) = rank([A|b]) = 2', 'The shared solution is one line where the distinct plane cuts the repeated plane.'],
  ['Two coincide; third is parallel', 'rank(A) < rank([A|b])', 'No common point: the distinct plane never reaches the repeated plane.'],
  ['Three distinct parallel planes', 'n₁ ∥ n₂ ∥ n₃; offsets differ', 'No common point because every pair is parallel and separated.'],
  ['Two parallel; third crosses both', 'n₁ ∥ n₂, but n₃ is not parallel', 'The third plane makes two parallel intersection lines, so no point lies on all three.'],
  ['Three planes share one line', 'rank(A) = rank([A|b]) = 2', 'Infinitely many common points arranged along one line.'],
  ['Three planes meet at one point', 'rank(A) = rank([A|b]) = 3', 'A unique solution (x, y, z); equivalently det(A) ≠ 0 for a square system.'],
  ['Pairwise intersections, no common point', 'rank(A) < rank([A|b])', 'Each pair meets in a line, but the three lines are parallel or form a triangular-prism pattern with no shared point.'],
];

const LINE_CASES = [
  ['Coincident', 'd₁ ∥ d₂ and one line’s point lies on the other', 'Infinitely many shared points: both vector equations trace the same line.'],
  ['Parallel and distinct', 'd₁ ∥ d₂ but the displacement is not parallel to d₁', 'No intersection; the distance between the lines is positive.'],
  ['Intersecting', 'r₁ + td₁ = r₂ + sd₂ has one consistent pair (t, s)', 'Exactly one common point.'],
  ['Skew', 'directions are not parallel, but the parameter system is inconsistent', 'No intersection and not parallel; this case exists only in 3D or higher.'],
];

function MiniGeometry({ index, line = false }) {
  const color = ['#a29bfe', '#55efc4', '#fdcb6e'][index % 3];
  if (line) {
    if (index === 0) return <svg viewBox="0 0 120 58" aria-hidden="true"><line x1="14" y1="45" x2="106" y2="12" stroke={color} strokeWidth="5" /><line x1="14" y1="45" x2="106" y2="12" stroke="#55efc4" strokeWidth="2" /></svg>;
    if (index === 1) return <svg viewBox="0 0 120 58" aria-hidden="true"><line x1="12" y1="45" x2="104" y2="20" stroke="#a29bfe" strokeWidth="4" /><line x1="16" y1="30" x2="108" y2="5" stroke="#55efc4" strokeWidth="4" /></svg>;
    if (index === 2) return <svg viewBox="0 0 120 58" aria-hidden="true"><line x1="10" y1="48" x2="105" y2="9" stroke="#a29bfe" strokeWidth="4" /><line x1="17" y1="8" x2="104" y2="49" stroke="#55efc4" strokeWidth="4" /><circle cx="61" cy="28" r="5" fill="#fdcb6e" /></svg>;
    return <svg viewBox="0 0 120 58" aria-hidden="true"><line x1="8" y1="46" x2="78" y2="10" stroke="#a29bfe" strokeWidth="4" /><line x1="45" y1="51" x2="111" y2="18" stroke="#55efc4" strokeWidth="4" strokeDasharray="7 4" /></svg>;
  }
  return <svg viewBox="0 0 120 58" aria-hidden="true"><path d="M8 40 L72 20 L112 34 L47 54 Z" fill="#a29bfe22" stroke="#a29bfe" strokeWidth="2" /><path d={`M${14 + index * 2} 10 L77 43 L108 34 L46 2 Z`} fill="#55efc422" stroke="#55efc4" strokeWidth="2" />{[5,6].includes(index) && <line x1="36" y1="26" x2="92" y2="38" stroke="#fdcb6e" strokeWidth="4" />}{index === 6 && <circle cx="62" cy="30" r="5" fill="#ff7675" />}</svg>;
}

function CaseGrid({ title, intro, cases, line = false }) {
  return <section className="rounded-xl border border-white/[0.08] bg-[#0b0d13] p-5 space-y-4">
    <div><h4 className="font-bold text-white">{title}</h4><p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{intro}</p></div>
    <div className="grid gap-3 sm:grid-cols-2">
      {cases.map(([name, test, meaning], index) => <article key={name} className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-3">
        <div className="grid grid-cols-[76px_1fr] items-center gap-3"><MiniGeometry index={index} line={line} /><div><div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-accent-light)]">Case {index + 1}</div><h5 className="text-sm font-bold text-white">{name}</h5></div></div>
        <p className="mt-2 text-xs text-[var(--color-warning)]"><MathText>{test}</MathText></p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{meaning}</p>
      </article>)}
    </div>
  </section>;
}

export default function IntersectionCases({ label = '' }) {
  if (!/lines and planes|intersections and distances/i.test(label)) return null;
  return <div className="space-y-4">
    <CaseGrid title="Eight cases for three planes" intro="Row-reduce the coefficient matrix A and augmented matrix [A|b]. Their ranks tell you whether the common solution is a plane, line, point, or empty set." cases={PLANE_CASES} />
    <CaseGrid title="Four cases for two lines in 3D" intro="Compare direction vectors first, then solve the two vector equations component-by-component for their parameters." cases={LINE_CASES} line />
  </div>;
}
