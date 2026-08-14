import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../engine/storage.js';
import { getDueConcepts } from '../engine/adaptive.js';
import { playSound } from '../utils/audio.js';
import StudySprintPlanner from './StudySprintPlanner.jsx';

function getMasteryColor(mastery) {
  if (mastery < 0.3) return '#ff7675';
  if (mastery < 0.5) return '#fdcb6e';
  if (mastery < 0.7) return '#ffeaa7';
  return '#55efc4';
}

function getConceptStatus(concept) {
  if (concept.learnedAt && (!concept.history || concept.history.length === 0)) {
    return { label: 'Ready to Recall', class: 'bg-[rgba(0,206,201,0.15)] text-[var(--color-success)] font-bold' };
  }
  if (!concept.history || concept.history.length === 0) {
    return { label: 'New', class: 'bg-[rgba(108,92,231,0.15)] text-[var(--color-accent-light)]' };
  }
  const diff = new Date(concept.nextReviewDate) - new Date();
  if (diff <= 0) {
    return { label: 'Due for Review', class: 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)] font-bold' };
  }
  if (concept.mastery >= 0.75) {
    return { label: 'Mastered', class: 'bg-[rgba(0,206,201,0.15)] text-[var(--color-success)] font-bold' };
  }
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return { label: `Review in ${hours}h`, class: 'bg-[var(--color-surface-3)] text-[var(--color-text-muted)]' };
  const days = Math.floor(hours / 24);
  return { label: `Review in ${days}d`, class: 'bg-[var(--color-surface-3)] text-[var(--color-text-muted)]' };
}

export default function DeckView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [missing, setMissing] = useState(false);
  const [dueConcepts, setDueConcepts] = useState([]);

  useEffect(() => {
    if (id) {
      const loadedDeck = getDeck(id);
      if (loadedDeck) {
        setMissing(false);
        setDeck(loadedDeck);
        setDueConcepts(getDueConcepts(loadedDeck.concepts));
      } else {
        setMissing(true);
        setDeck(null);
      }
    }
  }, [id]);

  const handleStartReview = () => {
    playSound('click');
    navigate(`/review/${deck.id}`);
  };

  if (missing) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass p-8 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-3">Deck not found</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">That deck is not saved in this browser.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--color-text-muted)]">Loading deck...</div>
      </div>
    );
  }

  const totalConcepts = deck.concepts?.length || 0;
  const totalQuestions = deck.questions?.length || 0;
  const totalReviews = deck.concepts?.reduce((acc, c) => acc + (c.history?.length || 0), 0) || 0;
  const averageMastery = totalConcepts > 0
    ? deck.concepts.reduce((acc, c) => acc + (c.mastery || 0), 0) / totalConcepts
    : 0;

  const studiedCount = deck.concepts?.filter(c => c.history && c.history.length > 0).length || 0;
  const newCount = totalConcepts - studiedCount;
  const unitGroups = (deck.units?.length
    ? deck.units.map((unit) => ({
      name: unit.name,
      definition: unit.definition,
      concepts: (deck.concepts || []).filter((concept) => concept.unit === unit.name || concept.topics?.includes(unit.name)),
    }))
    : Object.entries((deck.concepts || []).reduce((groups, concept) => {
      const unitName = concept.unit || 'Lessons';
      if (!groups[unitName]) groups[unitName] = [];
      groups[unitName].push(concept);
      return groups;
    }, {})).map(([name, concepts]) => ({ name, concepts }))
  ).filter((group) => group.concepts.length > 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Top back button */}
      <button
        onClick={() => { playSound('click'); navigate('/'); }}
        className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
      >
        <span className="mr-2">←</span> Back to Home
      </button>

      {/* Hero Header */}
      <div className="glass-strong p-8 rounded-2xl relative overflow-hidden border border-white/[0.08]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.2)] px-3 py-1 rounded-full">
              Study Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] mt-3">
              {deck.title || 'Untitled Deck'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {totalConcepts} concepts • {totalQuestions} questions • {studiedCount} studied / {newCount} new
            </p>
            {deck.university && (
              <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--color-accent-light)]">{deck.university}</span>
                {deck.syllabusUrl && (
                  <a
                    href={deck.syllabusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    Official course page ↗
                  </a>
                )}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">New Concepts</span>
              <span className="text-3xl font-bold text-[var(--color-accent-light)]">{newCount}</span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Due Review</span>
              <span className="text-3xl font-bold text-[var(--color-warning)]">{dueConcepts.length}</span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Avg Mastery</span>
              <span className="text-3xl font-bold" style={{ color: getMasteryColor(averageMastery) }}>
                {Math.round(averageMastery * 100)}%
              </span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Total Reviews</span>
              <span className="text-3xl font-bold text-white">{totalReviews}</span>
            </div>
          </div>

          {/* Distinct Modes Selection */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 text-center sm:text-left">
              Choose Mode:
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${deck.university ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
              {/* Mode 1: Learn / Teach */}
              <button
                onClick={() => { playSound('click'); navigate(`/learn/${deck.id}`); }}
                className="glass-strong p-5 rounded-2xl border-2 border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] hover:scale-[1.02] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🎓</span>
                    <span className="text-[10px] font-bold uppercase bg-[var(--color-accent)] text-white px-2 py-0.5 rounded-full">
                      Step 1
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[var(--color-text)] text-base group-hover:text-[var(--color-accent-light)] transition-colors">
                    Teacher Mode
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                    Learn concepts step-by-step with interactive explanations before taking quizzes.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[var(--color-accent-light)] flex items-center gap-1">
                  <span>Start Learning</span> →
                </div>
              </button>

              {/* Mode 2: Quiz / Spaced Repetition */}
              <button
                onClick={handleStartReview}
                className="glass-strong p-5 rounded-2xl border-2 border-[var(--color-success)]/40 hover:border-[var(--color-success)] hover:scale-[1.02] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[10px] font-bold uppercase bg-[var(--color-success)] text-black px-2 py-0.5 rounded-full">
                      Step 2
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[var(--color-text)] text-base group-hover:text-[var(--color-success)] transition-colors">
                    Quiz Knowledge
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                    Test yourself with adaptive questions tailored to your current mastery level.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[var(--color-success)] flex items-center gap-1">
                    <span>{dueConcepts.length === 0 ? 'Intro Quiz' : 'Start Quiz'}</span> →
                </div>
              </button>

              {/* Mode 3: Focus Mode */}
              <button
                onClick={() => { playSound('click'); navigate(`/review/${deck.id}?focus=true`); }}
                className="glass p-5 rounded-2xl border border-white/[0.08] hover:border-[var(--color-warning)] hover:scale-[1.02] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🎯</span>
                    <span className="text-[10px] font-bold uppercase bg-[rgba(253,203,110,0.2)] text-[var(--color-warning)] px-2 py-0.5 rounded-full">
                      Targeted
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[var(--color-text)] text-base group-hover:text-[var(--color-warning)] transition-colors">
                    Focus Mode
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                    Isolate the weakest 25% of lessons you have already quizzed. If you have no quiz history yet, study first.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[var(--color-warning)] flex items-center gap-1">
                  <span>Target Weak Spots</span> →
                </div>
              </button>

              {/* Mode 4: Analytics */}
              <button
                onClick={() => { playSound('click'); navigate(`/dashboard/${deck.id}`); }}
                className="glass p-5 rounded-2xl border border-white/[0.08] hover:border-white/30 hover:scale-[1.02] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-[10px] font-bold uppercase bg-white/[0.1] text-white px-2 py-0.5 rounded-full">
                      Stats
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[var(--color-text)] text-base group-hover:text-white transition-colors">
                    Dashboard
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                    View SM-2 memory retention charts and recall accuracy trends over time.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-white flex items-center gap-1">
                  <span>View Analytics</span> →
                </div>
              </button>

              {/* Mode 5: Practice Midterm (university courses only) */}
              {deck.university && (
                <button
                  onClick={() => { playSound('click'); navigate(`/review/${deck.id}?midterm=true`); }}
                  className="glass p-5 rounded-2xl border-2 border-[var(--color-danger)]/40 hover:border-[var(--color-danger)] hover:scale-[1.02] transition-all text-left group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">📝</span>
                      <span className="text-[10px] font-bold uppercase bg-[var(--color-danger)] text-white px-2 py-0.5 rounded-full">
                        Exam Prep
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[var(--color-text)] text-base group-hover:text-[var(--color-danger)] transition-colors">
                      Practice Midterm
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                      Full-course hard-difficulty question set covering every unit, regardless of review schedule.
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-bold text-[var(--color-danger)] flex items-center gap-1">
                    <span>Start Practice Midterm</span> →
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <StudySprintPlanner
        deck={deck}
        onReview={handleStartReview}
        onFocus={() => { playSound('click'); navigate(`/review/${deck.id}?focus=true`); }}
        onLearn={() => { playSound('click'); navigate(`/learn/${deck.id}`); }}
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-[var(--color-text)]">
          <span>📚</span> Concepts List
          <span className="text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface-3)] px-3 py-1 rounded-full">
            {totalConcepts} Total
          </span>
        </h2>

        <div className="space-y-6">
          {unitGroups.map((unit, unitIndex) => (
            <section key={unit.name} className="space-y-3 animate-slide-up" style={{ animationDelay: `${unitIndex * 60}ms` }}>
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-2">
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--color-text)]">{unit.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{unit.concepts.length} lessons in this unit</p>
                </div>
                <span className="badge bg-white/[0.06] text-[var(--color-accent-light)]">
                  Unit {unitIndex + 1}
                </span>
              </div>

              {unit.definition && (
                <div className="rounded-xl border border-[var(--color-accent)]/20 bg-[rgba(108,92,231,0.06)] p-4 space-y-2">
                  {unit.definition.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
                    <p key={index} className="text-xs leading-relaxed text-[var(--color-text-muted)]">{paragraph}</p>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unit.concepts.map((concept, index) => {
                  const status = getConceptStatus(concept);
                  return (
                    <button
                      type="button"
                      key={concept.id}
                      onClick={() => { playSound('click'); navigate(`/learn/${deck.id}?concept=${encodeURIComponent(concept.id)}`); }}
                      className="glass p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-white/[0.06] hover:border-[var(--color-accent)]/40 flex flex-col justify-between text-left w-full"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h4 className="font-bold text-[var(--color-text)] text-base">{concept.label}</h4>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded font-semibold shrink-0 ${status.class}`}>
                            {status.label}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 leading-relaxed mb-4">
                          {concept.sourceSnippet}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--color-text-muted)]">Mastery</span>
                          <span style={{ color: getMasteryColor(concept.mastery || 0) }} className="font-bold font-mono">
                            {Math.round((concept.mastery || 0) * 100)}%
                          </span>
                        </div>
                        <div className="mastery-bar">
                          <div
                            className="mastery-bar-fill"
                            style={{
                              width: `${(concept.mastery || 0) * 100}%`,
                              backgroundColor: getMasteryColor(concept.mastery || 0),
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
                          <span>{concept.history?.length || 0} reviews</span>
                          <span
                            title="SM-2 easiness factor. Starts at 2.5 and drops when answers are missed, which shortens the next interval."
                          >
                            Ease {concept.easinessFactor ? concept.easinessFactor.toFixed(1) : '2.5'} (SM-2)
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
