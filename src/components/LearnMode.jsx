import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../engine/storage.js';
import { playSound } from '../utils/audio.js';

export default function LearnMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedConcepts, setReviewedConcepts] = useState(new Set());

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
  });

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
      playSound('click');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      playSound('click');
    }
  };

  const toggleReviewed = () => {
    if (!currentConcept) return;
    const newReviewed = new Set(reviewedConcepts);
    if (newReviewed.has(currentConcept.id)) {
      newReviewed.delete(currentConcept.id);
    } else {
      newReviewed.add(currentConcept.id);
      playSound('correct');
    }
    setReviewedConcepts(newReviewed);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button 
        onClick={() => navigate(`/deck/${id}`)}
        className="text-[var(--color-text-muted)] hover:text-white flex items-center gap-2 mb-4 transition-colors"
      >
        ← Back to Deck
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Learn Mode</h2>
        <span className="badge bg-white/[0.05] text-[var(--color-text-muted)]">
          Concept {currentIndex + 1} of {concepts.length}
        </span>
      </div>

      <div className="glass-strong p-8 rounded-2xl relative min-h-[300px] flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-6 text-[var(--color-accent-light)] text-center">
          {currentConcept?.label}
        </h3>
        
        <div className="bg-[var(--color-surface-2)] p-6 rounded-xl border border-white/[0.05] text-lg text-[var(--color-text)] leading-relaxed mb-8 shadow-inner">
          {currentConcept?.sourceSnippet || "No description available for this concept."}
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={toggleReviewed}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              isReviewed 
                ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/40 shadow-[0_0_15px_rgba(0,206,201,0.2)]' 
                : 'bg-white/[0.05] text-[var(--color-text-muted)] border border-white/[0.1] hover:bg-white/[0.1]'
            }`}
          >
            <span className="text-xl leading-none">{isReviewed ? '☑' : '☐'}</span>
            <span>{isReviewed ? 'Reviewed' : 'Mark as Reviewed'}</span>
          </button>
        </div>
        
        <div className="text-center text-xs text-[var(--color-text-muted)] font-mono opacity-60">
          Press [Enter] to mark, [←] [→] to navigate
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-30 flex items-center gap-2"
        >
          ← Previous
        </button>
        
        <button 
          onClick={handleNext} 
          disabled={currentIndex === concepts.length - 1}
          className="btn-secondary disabled:opacity-30 flex items-center gap-2"
        >
          Next →
        </button>
      </div>

      <div className="mt-12 glass p-6 rounded-2xl text-center space-y-4">
        <p className="text-[var(--color-text-muted)] text-sm">
          You've reviewed <strong className="text-white text-base">{reviewedConcepts.size}</strong> of <strong className="text-white text-base">{concepts.length}</strong> concepts
        </p>
        <button 
          onClick={() => navigate(`/review/${id}`)}
          className="btn-primary w-full sm:w-auto text-lg py-3 px-8 shadow-lg shadow-[var(--color-accent)]/20"
        >
          Start Quiz →
        </button>
      </div>
    </div>
  );
}
