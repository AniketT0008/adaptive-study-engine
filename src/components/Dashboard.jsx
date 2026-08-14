import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../engine/storage.js';
import MasteryChart from './charts/MasteryChart.jsx';
import AccuracyTrend from './charts/AccuracyTrend.jsx';
import ComparisonChart from './charts/ComparisonChart.jsx';
import SM2Sandbox from './SM2Sandbox.jsx';
import RecallHistory from './RecallHistory.jsx';

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [missing, setMissing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'sandbox'

  useEffect(() => {
    if (id) {
      const data = getDeck(id);
      if (data) {
        setMissing(false);
        setDeck(data);
      } else {
        setMissing(true);
        setDeck(null);
      }
    }
  }, [id]);

  if (missing) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass p-8 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Deck not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--color-text-muted)]">Loading dashboard...</div>
      </div>
    );
  }

  const totalReviews = deck.concepts.reduce((sum, c) => sum + (c.history?.length || 0), 0);
  const sessionLogs = deck.sessionLogs || [];
  const historyLogs = deck.concepts.flatMap((concept) =>
    (concept.history || []).map((attempt) => ({
      correct: attempt.correct,
      timestamp: attempt.timestamp,
    })),
  );
  const accuracySource = sessionLogs.length > 0 ? sessionLogs : historyLogs;
  const totalCorrect = accuracySource.filter((log) => log.correct).length;
  const accuracy = accuracySource.length > 0 ? Math.round((totalCorrect / accuracySource.length) * 100) : 0;
  const avgMastery = deck.concepts.length > 0
    ? Math.round((deck.concepts.reduce((s, c) => s + (c.mastery || 0), 0) / deck.concepts.length) * 100)
    : 0;

  const getMasteryColor = (val) => {
    if (val >= 70) return 'text-[#55efc4]';
    if (val >= 50) return 'text-[#ffeaa7]';
    if (val >= 30) return 'text-[#fdcb6e]';
    return 'text-[#ff7675]';
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate(`/deck/${id}`)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
            >
              ← Back to Deck
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text)] flex items-center gap-3">
            📊 Adaptive Analytics &amp; Dashboard
          </h1>
          <h2 className="text-[var(--color-accent-light)] text-lg font-medium mt-1">{deck.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="glass p-1 rounded-xl flex items-center gap-1 border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'overview' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'history' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              📜 Recall History
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'sandbox' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              🔬 SM-2 Sandbox
            </button>
          </div>

          <button
            onClick={() => navigate(`/review/${id}`)}
            className="btn-primary px-4 py-2.5 text-xs font-bold"
          >
            ▶ Start Review
          </button>
        </div>
      </div>

      {activeTab === 'sandbox' ? (
        <SM2Sandbox />
      ) : activeTab === 'history' ? (
        <RecallHistory sessionLogs={sessionLogs} concepts={deck.concepts} />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '0ms' }}>
              <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wider mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-[var(--color-text)]">{totalReviews}</p>
            </div>
            <div className="glass p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '80ms' }}>
              <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wider mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-[var(--color-accent-light)]">{accuracy}%</p>
            </div>
            <div className="glass p-5 rounded-2xl animate-slide-up relative overflow-hidden" style={{ animationDelay: '160ms' }}>
              {deck.streak > 3 && <div className="absolute -right-3 -top-3 text-5xl opacity-10">🔥</div>}
              <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wider mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-[var(--color-warning)] flex items-center gap-2">
                {deck.streak || 0} {deck.streak > 3 && <span>🔥</span>}
              </p>
            </div>
            <div className="glass p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '240ms' }}>
              <p className="text-[var(--color-text-muted)] text-xs font-medium uppercase tracking-wider mb-1">Avg Mastery</p>
              <p className={`text-3xl font-bold ${getMasteryColor(avgMastery)}`}>{avgMastery}%</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '320ms' }}>
              <MasteryChart concepts={deck.concepts} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <AccuracyTrend sessionLogs={accuracySource} streak={deck.streak || 0} />
            </div>
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '480ms' }}>
              <ComparisonChart concepts={deck.concepts} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
