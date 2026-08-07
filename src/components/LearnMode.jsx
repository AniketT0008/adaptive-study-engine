import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, saveDeck } from '../engine/storage.js';
import { playSound } from '../utils/audio.js';

export default function LearnMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedConcepts, setReviewedConcepts] = useState(new Set());
  const [showSimplified, setShowSimplified] = useState(false);

  useEffect(() => {
    const loadedDeck = getDeck(id);
    if (loadedDeck) {
      setDeck(loadedDeck);
    }
  }, [id]);

  const concepts = deck?.concepts || [];
  const currentConcept = concepts[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentConcept) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Enter') {
        toggleReviewed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentConcept, currentIndex, concepts.length]);

  if (!deck) {
    return <div className="text-center p-8 text-[var(--color-text-muted)]">Loading deck...</div>;
  }

  if (concepts.length === 0) {
    return <div className="text-center p-8 text-[var(--color-text-muted)]">No concepts found in this deck.</div>;
  }

  const isReviewed = reviewedConcepts.has(currentConcept?.id);

  const handleNext = () => {
    if (currentIndex < concepts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSimplified(false);
      playSound('click');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowSimplified(false);
      playSound('click');
    }
  };

  const toggleReviewed = () => {
    if (!currentConcept || !deck) return;
    const newReviewed = new Set(reviewedConcepts);
    const now = new Date().toISOString();
    
    if (newReviewed.has(currentConcept.id)) {
      newReviewed.delete(currentConcept.id);
    } else {
      newReviewed.add(currentConcept.id);
      playSound('correct');
      
      const updatedConcepts = deck.concepts.map(c => 
        c.id === currentConcept.id ? { ...c, nextReviewDate: now } : c
      );
      const updatedDeck = { ...deck, concepts: updatedConcepts };
      saveDeck(updatedDeck);
      setDeck(updatedDeck);
    }
    setReviewedConcepts(newReviewed);
  };

  // Extract key points
  const keyPoints = currentConcept?.sourceSnippet
    ? currentConcept.sourceSnippet.split('. ').filter(s => s.trim().length > 10).slice(0, 3)
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(`/deck/${id}`)}
          className="text-[var(--color-text-muted)] hover:text-white flex items-center gap-2 transition-colors text-sm font-medium"
        >
          ← Back to Deck
        </button>

        {/* Step Indicator Header */}
        <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] text-xs font-semibold">
          <span className="bg-[var(--color-accent)] text-white px-3 py-1 rounded-full">
            🎓 Step 1: Teacher Mode
          </span>
          <span className="text-[var(--color-text-muted)] px-2">→</span>
          <span className="text-[var(--color-text-muted)] px-2">
            ⚡ Step 2: Quiz Knowledge
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-[var(--color-text)] flex items-center gap-2">
          <span>🎓</span> Interactive AI Teacher
        </h2>
        <span className="badge bg-white/[0.05] text-[var(--color-accent-light)] font-mono">
          Concept {currentIndex + 1} of {concepts.length}
        </span>
      </div>

      {/* Main Teaching Card */}
      <div className="glass-strong p-8 rounded-2xl relative space-y-6 border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[var(--color-accent-light)] font-bold bg-[rgba(108,92,231,0.2)] px-3 py-1 rounded-full">
            Core Explanation
          </span>
          <button
            onClick={() => setShowSimplified(!showSimplified)}
            className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] px-3 py-1 rounded-lg border border-white/[0.08] transition-colors"
          >
            {showSimplified ? '📖 Show Full Lesson' : '💡 Explain Simply'}
          </button>
        </div>

        <h3 className="text-3xl font-extrabold text-[var(--color-text)]">
          {currentConcept?.label}
        </h3>
        
        {!showSimplified ? (
          <div className="bg-[var(--color-surface-2)] p-6 rounded-xl border border-white/[0.06] text-base text-[var(--color-text)] leading-relaxed shadow-inner">
            {currentConcept?.sourceSnippet || "No lesson content available for this concept."}
          </div>
        ) : (
          <div className="bg-[rgba(108,92,231,0.1)] p-6 rounded-xl border border-[var(--color-accent)]/30 text-base text-[var(--color-accent-light)] leading-relaxed">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-white">
              <span>💡</span> Simplified Summary:
            </h4>
            <p>{currentConcept?.sourceSnippet}</p>
          </div>
        )}

        {/* Worked Example / Mathematical Formula Box */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-2">
            <span>📌</span> Worked Example / Mathematical Application:
          </h4>
          <div className="bg-[#12151e] p-5 rounded-xl border border-[var(--color-success)]/30 text-sm font-mono text-white leading-relaxed space-y-2 shadow-lg">
            {currentConcept?.example ? (
              <p className="whitespace-pre-wrap">{currentConcept.example}</p>
            ) : (
              <p className="text-[var(--color-text-muted)] italic">
                Example: Application of {currentConcept?.label} in problem solving.
              </p>
            )}
          </div>
        </div>

        {/* Key Takeaways */}
        {keyPoints.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              🔑 Key Takeaways to Remember:
            </h4>
            <ul className="space-y-1.5">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="text-xs text-[var(--color-text)] flex items-start gap-2 bg-white/[0.03] p-2.5 rounded-lg">
                  <span className="text-[var(--color-success)] font-bold">•</span>
                  <span>{point.trim()}{point.endsWith('.') ? '' : '.'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reviewed Toggle Button */}
        <div className="pt-4 flex flex-col items-center gap-2 border-t border-white/[0.06]">
          <button
            onClick={toggleReviewed}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
              isReviewed 
                ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/40 shadow-[0_0_15px_rgba(0,206,201,0.2)]' 
                : 'bg-white/[0.06] text-[var(--color-text)] border border-white/[0.1] hover:bg-white/[0.1]'
            }`}
          >
            <span className="text-xl leading-none">{isReviewed ? '✓' : '☐'}</span>
            <span>{isReviewed ? 'Learned & Understood!' : 'Mark as Learned & Ready'}</span>
          </button>
          <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
            Press [Enter] to toggle • [←] [→] to navigate
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-30 flex items-center gap-2 text-sm font-bold px-5 py-2.5"
        >
          ← Previous Concept
        </button>
        
        <button 
          onClick={handleNext} 
          disabled={currentIndex === concepts.length - 1}
          className="btn-secondary disabled:opacity-30 flex items-center gap-2 text-sm font-bold px-5 py-2.5"
        >
          Next Concept →
        </button>
      </div>

      {/* Quiz Call to Action Footer */}
      <div className="glass p-6 rounded-2xl text-center space-y-4 border border-white/[0.08]">
        <div className="flex items-center justify-between max-w-md mx-auto text-sm">
          <span className="text-[var(--color-text-muted)]">Progress:</span>
          <span className="font-bold text-[var(--color-success)]">{reviewedConcepts.size} of {concepts.length} learned</span>
        </div>
        <div className="progress-bar max-w-md mx-auto">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(reviewedConcepts.size / concepts.length) * 100}%`, backgroundColor: '#00cec9' }} 
          />
        </div>

        <div className="pt-2">
          <button 
            onClick={() => {
              playSound('click');
              navigate(`/review/${id}`);
            }}
            className="btn-primary py-3.5 px-8 text-base font-bold shadow-lg shadow-[var(--color-accent)]/20"
          >
            ⚡ Test Your Knowledge (Quiz) →
          </button>
        </div>
      </div>
    </div>
  );
}
