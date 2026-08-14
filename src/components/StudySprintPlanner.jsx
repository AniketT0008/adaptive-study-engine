import { useMemo, useState } from 'react';
import { buildStudySprint } from '../engine/studyPlan.js';
import { playSound } from '../utils/audio.js';

function readinessColor(score) {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-accent-light)';
  if (score >= 35) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export default function StudySprintPlanner({ deck, onReview, onFocus, onLearn }) {
  const [minutes, setMinutes] = useState(45);
  const sprint = useMemo(() => buildStudySprint(deck, minutes), [deck, minutes]);

  const handleMinutes = (value) => {
    setMinutes(value);
    playSound('click');
  };

  return (
    <section className="glass-strong p-5 sm:p-6 rounded-2xl border border-[var(--color-accent)]/20 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)]">Adaptive Study Sprint</h2>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl">
            A live plan that turns mastery, overdue reviews, and weak units into the next best study session.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          {[25, 45, 90].map((value) => (
            <button
              key={value}
              onClick={() => handleMinutes(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                minutes === value
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {value}m
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        <div className="glass p-5 rounded-xl border border-white/[0.08] flex flex-col items-center justify-center text-center">
          <div
            className="relative grid place-items-center rounded-full w-32 h-32"
            role="img"
            aria-label={`Readiness ${sprint.readiness} out of 100`}
            style={{
              background: `conic-gradient(${readinessColor(sprint.readiness)} ${sprint.readiness * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="absolute inset-3 rounded-full bg-[var(--color-surface)]" />
            <div className="relative">
              <div className="text-4xl font-black" style={{ color: readinessColor(sprint.readiness) }}>
                {sprint.readiness}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold">Readiness</div>
            </div>
          </div>
          <h3 className="mt-4 text-base font-extrabold text-white">{sprint.headline}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{sprint.minutes} minute sprint plan</p>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-2">{sprint.readinessScale}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sprint.actions.map((action, index) => (
            <div key={action} className="glass p-4 rounded-xl border border-white/[0.08]">
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-accent-light)] font-bold mb-2">
                {index === 0 ? 'Review' : index === 1 ? 'Learn' : 'Repair'}
              </div>
              <p className="text-sm font-bold text-[var(--color-text)]">{action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[var(--color-text)]">Highest Impact Lessons</h3>
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{sprint.priorities.length} queued</span>
          </div>
          <div role="region" tabIndex="0" aria-label="Highest impact lessons" className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sprint.priorities.slice(0, 8).map((concept, index) => (
              <div key={concept.id} className="glass p-3 rounded-lg border border-white/[0.06] flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-white/[0.06] text-[11px] font-black text-[var(--color-accent-light)] grid place-items-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--color-text)] truncate">{concept.label}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate">{concept.unit || 'Lessons'} · {concept.reason}</p>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: readinessColor(Math.round((concept.mastery || 0) * 100)) }}>
                  {Math.round((concept.mastery || 0) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-[var(--color-text)]">Unit Risk Radar</h3>
          <div role="region" tabIndex="0" aria-label="Unit risk details" className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sprint.units.slice(0, 8).map((unit) => (
              <div key={unit.name} className="glass p-3 rounded-lg border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[var(--color-text)] truncate">{unit.name}</p>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-mono">{unit.mastery}% mastery</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${unit.risk}%`, backgroundColor: readinessColor(100 - unit.risk) }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
                  <span>{unit.weak} weak</span>
                  <span>{unit.due} due</span>
                  <span>{unit.total} lessons</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onReview} className="btn-primary flex-1 text-sm font-bold">
          Start Sprint Review
        </button>
        <button onClick={onFocus} className="btn-focus flex-1 text-sm font-bold">
          Attack Weakest Lessons
        </button>
        <button onClick={onLearn} className="btn-secondary flex-1 text-sm font-bold">
          Preview Lessons
        </button>
      </div>
    </section>
  );
}
