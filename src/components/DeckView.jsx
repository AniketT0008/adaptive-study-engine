import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, saveDeck } from '../engine/storage.js';
import { getDueConcepts } from '../engine/adaptive.js';
import { playSound } from '../utils/audio.js';

function getMasteryColor(mastery) {
  if (mastery < 0.3) return '#ff7675';
  if (mastery < 0.5) return '#fdcb6e';
  if (mastery < 0.7) return '#ffeaa7';
  return '#55efc4';
}

function getRelativeTime(concept) {
  if (!concept.nextReviewDate) return 'N/A';
  // If never reviewed, show friendly label
  if (!concept.history || concept.history.length === 0) return 'Ready to study';
  const diff = new Date(concept.nextReviewDate) - new Date();
  if (diff <= 0) return 'Due now';
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Due soon';
  if (hours < 24) return `In ${hours}h`;
  const days = Math.floor(hours / 24);
  return `In ${days}d`;
}

function getRelativeTimeBadgeClass(concept) {
  if (!concept.history || concept.history.length === 0) return 'bg-[rgba(108,92,231,0.15)] text-[var(--color-accent-light)]';
  const diff = new Date(concept.nextReviewDate) - new Date();
  if (diff <= 0) return 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]';
  return 'bg-[var(--color-surface-3)] text-[var(--color-text-muted)]';
}

export default function DeckView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [dueConcepts, setDueConcepts] = useState([]);

  useEffect(() => {
    if (id) {
      const loadedDeck = getDeck(id);
      if (loadedDeck) {
        setDeck(loadedDeck);
        setDueConcepts(getDueConcepts(loadedDeck.concepts));
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleStartReview = () => {
    playSound('click');
    if (dueConcepts.length === 0 && deck?.concepts) {
      const now = new Date().toISOString();
      const updatedDeck = {
        ...deck,
        concepts: deck.concepts.map(c => ({ ...c, nextReviewDate: now }))
      };
      saveDeck(updatedDeck);
    }
    navigate(`/review/${deck.id}`);
  };

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
  const createdDate = deck.createdAt ? new Date(deck.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => { playSound('click'); navigate('/'); }}
        className="mb-6 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
      >
        <span className="mr-2">←</span> Back to Home
      </button>

      {/* Hero card */}
      <div className="glass-strong p-8 rounded-2xl mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-success)] opacity-10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent)] opacity-10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--color-text-muted)]">
            {deck.title || 'Untitled Deck'}
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8 font-medium">
            {totalConcepts} concepts • {totalQuestions} questions • Created {createdDate}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Due Review</span>
              <span className="text-3xl font-bold text-[var(--color-danger)]">{dueConcepts.length}</span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Avg Mastery</span>
              <span className="text-3xl font-bold" style={{ color: getMasteryColor(averageMastery) }}>
                {Math.round(averageMastery * 100)}%
              </span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Total Reviews</span>
              <span className="text-3xl font-bold text-[var(--color-accent-light)]">{totalReviews}</span>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider block mb-1">Streak</span>
              <span className="text-3xl font-bold text-[var(--color-warning)]">{deck.streak || 0} 🔥</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { playSound('click'); navigate(`/learn/${deck.id}`); }}
              className="btn-secondary px-8 py-4 text-lg font-bold flex items-center gap-2"
            >
              📖 Learn First
            </button>

            <button
              onClick={handleStartReview}
              className="btn-primary px-8 py-4 text-lg font-bold flex items-center gap-2 glow-accent animate-pulse-glow"
            >
              {dueConcepts.length === 0 ? '▶ Practice All' : '▶ Start Review'}
            </button>

            <button
              onClick={() => { playSound('click'); navigate(`/review/${deck.id}?focus=true`); }}
              className="btn-focus px-8 py-4 text-lg font-bold flex items-center gap-2 glow-success"
            >
              🎯 Focus Mode
            </button>

            <button
              onClick={() => { playSound('click'); navigate(`/dashboard/${deck.id}`); }}
              className="btn-secondary px-8 py-4 text-lg font-bold flex items-center gap-2"
            >
              📊 Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Concept Grid */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--color-text)]">
        Concepts
        <span className="text-sm font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-3)] px-3 py-1 rounded-full">
          {totalConcepts}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deck.concepts?.map((concept, index) => {
          const isDue = new Date(concept.nextReviewDate) <= new Date();
          const neverReviewed = !concept.history || concept.history.length === 0;
          return (
            <div
              key={concept.id}
              className={`glass p-5 rounded-xl transition-all duration-300 animate-slide-up hover:scale-[1.02] hover:border-[var(--color-accent)]/30 cursor-default ${
                isDue && !neverReviewed ? 'border-l-2 border-l-[var(--color-warning)]' : ''
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[var(--color-text)] text-base">{concept.label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${getRelativeTimeBadgeClass(concept)}`}>
                  {getRelativeTime(concept)}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Mastery</span>
                  <span style={{ color: getMasteryColor(concept.mastery || 0) }} className="font-bold">
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
              </div>

              <div className="text-xs text-[var(--color-text-muted)]">
                Reviewed {concept.history?.length || 0} times
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
