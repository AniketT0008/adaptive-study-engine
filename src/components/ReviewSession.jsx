import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getDeck, saveDeck } from '../engine/storage.js';
import { getDueConcepts, getFollowUpQuestion, selectNextQuestion, updateConceptAfterAnswer } from '../engine/adaptive.js';
import QuestionCard from './QuestionCard.jsx';
import { playSound } from '../utils/audio.js';

export default function ReviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const focusMode = searchParams.get('focus') === 'true';
  const midtermMode = searchParams.get('midterm') === 'true';

  const [deck, setDeck] = useState(null);
  const [queue, setQueue] = useState([]);      // [{ question, concept }]
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentMasteryChange, setCurrentMasteryChange] = useState(null);

  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    streak: 0,
    longestStreak: 0,
    conceptChanges: [],
  });

  const initQueue = useCallback((loadedDeck) => {
    if (!loadedDeck || !loadedDeck.concepts) return;

    if (midtermMode) {
      // Practice Midterm: every concept in the course, hardest question available
      // for each one, in a random exam-style order — ignores review scheduling.
      const shuffled = [...loadedDeck.concepts].sort(() => Math.random() - 0.5);
      const q = [];
      shuffled.forEach((concept) => {
        const conceptQs = (loadedDeck.questions || []).filter((qq) => qq.conceptId === concept.id);
        if (conceptQs.length === 0) return;
        const hard = conceptQs.filter((qq) => qq.difficulty === 'hard');
        const pool = hard.length > 0 ? hard : conceptQs;
        const question = pool[Math.floor(Math.random() * pool.length)];
        q.push({ question, concept: { ...concept } });
      });
      setQueue(q);
      setCurrentIndex(0);
      setIsFinished(q.length === 0);
      return;
    }

    // Get due concepts (pass the concepts array)
    const dueConcepts = getDueConcepts(loadedDeck.concepts, focusMode);

    // Focus mode stays with each weak concept long enough to diagnose it:
    // direct application, visual/scenario transfer, then error analysis.
    const q = [];
    dueConcepts.forEach(concept => {
      const conceptQuestions = (loadedDeck.questions || []).filter((question) => question.conceptId === concept.id);
      if (focusMode) {
        const ordered = ['easy', 'medium', 'hard']
          .map((difficulty) => conceptQuestions.find((question) => question.difficulty === difficulty))
          .filter(Boolean);
        ordered.forEach((question) => q.push({ question, concept: { ...concept } }));
      } else {
        const question = selectNextQuestion(loadedDeck.questions, concept);
        if (question) q.push({ question, concept: { ...concept } });
      }
    });

    setQueue(q);
    setCurrentIndex(0);
    setIsFinished(q.length === 0);
  }, [focusMode, midtermMode]);

  // Load deck and build question queue
  useEffect(() => {
    const loadedDeck = getDeck(id);
    if (!loadedDeck) {
      navigate('/');
      return;
    }
    setDeck(loadedDeck);
    initQueue(loadedDeck);
  }, [id, focusMode, navigate, initQueue]);

  const toggleFocusMode = () => {
    playSound('click');
    const newParams = new URLSearchParams(searchParams);
    if (focusMode) {
      newParams.delete('focus');
    } else {
      newParams.set('focus', 'true');
    }
    setSearchParams(newParams);
  };

  const handleRestart = () => {
    playSound('click');
    setSessionStats({
      correct: 0,
      wrong: 0,
      streak: 0,
      longestStreak: 0,
      conceptChanges: [],
    });
    setCurrentMasteryChange(null);
    const reloaded = getDeck(id);
    if (reloaded) {
      setDeck(reloaded);
      initQueue(reloaded);
    }
  };

  const handleAnswer = useCallback((isCorrect, question) => {
    if (!deck || !queue[currentIndex]) return;

    const currentItem = queue[currentIndex];
    if (!currentItem?.concept) return;

    const conceptId = currentItem.concept.id;

    // Get current concept from deck
    const conceptBefore = deck.concepts.find(c => c.id === conceptId);
    const masteryBefore = conceptBefore?.mastery || 0;

    // Update the concept using the adaptive engine
    const updatedConcept = updateConceptAfterAnswer(conceptBefore, isCorrect, question.difficulty, question.id);
    const masteryAfter = updatedConcept ? updatedConcept.mastery : masteryBefore;

    // Build updated deck with the modified concept
    const updatedConcepts = deck.concepts.map(c =>
      c.id === conceptId ? updatedConcept : c
    );

    // Update streak
    let newStreak = isCorrect ? (deck.streak || 0) + 1 : 0;
    let newLongestStreak = Math.max(deck.longestStreak || 0, newStreak);

    // Play streak milestone sound if streak >= 3
    if (isCorrect && newStreak >= 3 && newStreak % 3 === 0) {
      playSound('streak');
    }

    // Add session log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      questionId: question.id,
      conceptId,
      correct: isCorrect,
      difficulty: question.difficulty,
    };

    const updatedDeck = {
      ...deck,
      concepts: updatedConcepts,
      sessionLogs: [...(deck.sessionLogs || []), logEntry],
      streak: newStreak,
      longestStreak: newLongestStreak,
    };

    // Save to localStorage and update state
    saveDeck(updatedDeck);
    setDeck(updatedDeck);

    // Track session stats
    setSessionStats(prev => {
      const s = isCorrect ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        streak: s,
        longestStreak: Math.max(prev.longestStreak, s),
        conceptChanges: [
          ...prev.conceptChanges,
          { label: currentItem.concept.label, before: masteryBefore, after: masteryAfter },
        ],
      };
    });

    // Show mini mastery change
    setCurrentMasteryChange({
      label: currentItem.concept.label,
      before: masteryBefore,
      after: masteryAfter,
      isUp: masteryAfter > masteryBefore,
    });

    // A correct retrieval earns an immediate, harder version of the same lesson.
    // An incorrect response remains at the current foundation level for the next due review.
    const queuedQuestionIds = new Set(queue.map((item) => item.question.id));
    const followUp = !focusMode && !midtermMode
      ? getFollowUpQuestion(deck.questions, conceptId, question, queuedQuestionIds, isCorrect)
      : null;
    const nextQueue = followUp
      ? [...queue.slice(0, currentIndex + 1), { question: followUp, concept: { ...updatedConcept } }, ...queue.slice(currentIndex + 1)]
      : queue;

    if (followUp) setQueue(nextQueue);

    // Move to next question or finish.
    if (currentIndex + 1 < nextQueue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      playSound('streak');
    }
  }, [deck, queue, currentIndex, focusMode, midtermMode]);

  // --- Loading State ---
  if (!deck) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4 animate-spin">⚡</div>
          <p className="text-[var(--color-text-muted)]">Loading study session...</p>
        </div>
      </div>
    );
  }

  // --- Empty / All Caught Up State ---
  if (isFinished && queue.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-md border border-white/[0.08]">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">All caught up!</h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            {focusMode ? 'No weak concepts due right now.' : 'No concepts are due for review right now. Great job!'}
          </p>
          <div className="flex justify-center gap-3">
            {focusMode && (
              <button onClick={toggleFocusMode} className="btn-secondary text-sm">
                Turn off Focus Mode
              </button>
            )}
            <button onClick={() => navigate(`/deck/${id}`)} className="btn-primary text-sm">
              ← Back to Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Session Complete State ---
  if (isFinished) {
    const total = sessionStats.correct + sessionStats.wrong;
    const accuracy = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
    const allCorrect = sessionStats.wrong === 0 && total > 0;

    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <div className="glass-strong p-8 rounded-2xl border border-white/[0.08]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-2">
              Session Complete! {allCorrect && '🎉🎊'}
            </h1>
            <p className="text-[var(--color-text-muted)]">Here's how your mastery evolved.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Correct</div>
              <div className="text-3xl font-bold text-[var(--color-success)]">{sessionStats.correct}</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Wrong</div>
              <div className="text-3xl font-bold text-[var(--color-danger)]">{sessionStats.wrong}</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Accuracy</div>
              <div className="text-3xl font-bold text-[var(--color-accent-light)]">{accuracy}%</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Best Streak</div>
              <div className="text-3xl font-bold text-[var(--color-warning)]">🔥 {sessionStats.longestStreak}</div>
            </div>
          </div>

          {sessionStats.conceptChanges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-white/[0.06] pb-2 mb-4">Mastery Changes</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {sessionStats.conceptChanges.map((change, i) => (
                  <div key={i} className="flex justify-between items-center glass p-3 rounded-lg">
                    <span className="font-medium text-[var(--color-text)] text-sm">{change.label}</span>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-[var(--color-text-muted)]">{Math.round(change.before * 100)}%</span>
                      <span className={change.after > change.before ? 'text-[var(--color-success)] font-bold' : change.after < change.before ? 'text-[var(--color-danger)] font-bold' : 'text-[var(--color-text-muted)]'}>
                        {change.after > change.before ? '↑' : change.after < change.before ? '↓' : '→'}
                      </span>
                      <span className={change.after > change.before ? 'text-[var(--color-success)] font-bold' : change.after < change.before ? 'text-[var(--color-danger)] font-bold' : 'text-[var(--color-text-muted)]'}>
                        {Math.round(change.after * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleRestart} className="btn-secondary">
              🔄 Review Again
            </button>
            <button onClick={() => navigate(`/dashboard/${id}`)} className="btn-primary">
              📊 View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safe check for current item before rendering active quiz
  const currentItem = queue[currentIndex];
  if (!currentItem || !currentItem.question) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass p-8 rounded-2xl text-center">
          <p className="text-[var(--color-text-muted)]">Preparing next question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 animate-fade-in">
      {/* Practice Midterm Banner */}
      {midtermMode && (
        <div className="mb-4 p-3 rounded-xl bg-[rgba(255,118,117,0.1)] border border-[rgba(255,118,117,0.25)] flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-danger)] flex items-center gap-2">
            📝 Practice Midterm — full-course, hard-difficulty questions
          </span>
        </div>
      )}

      {/* Focus Mode Banner */}
      {!midtermMode && focusMode && (
        <div className="mb-4 p-3 rounded-xl bg-[rgba(0,206,201,0.1)] border border-[rgba(0,206,201,0.2)] flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-success)] flex items-center gap-2">
            🎯 Focus Mode Active — Targeting your weakest concepts
          </span>
          <button
            onClick={toggleFocusMode}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-2.5 py-1 rounded bg-white/[0.05]"
          >
            Turn off
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
            <span>🎯 Question {currentIndex + 1} of {queue.length}</span>
            <span className="text-xs font-mono font-bold text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.2)] px-2 py-0.5 rounded-full border border-[var(--color-accent)]/30">
              {Math.round(((currentIndex + 1) / queue.length) * 100)}%
            </span>
          </span>
          <button
            onClick={() => navigate(`/deck/${id}`)}
            className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/[0.06]"
          >
            ✕ End session
          </button>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }} />
        </div>
      </div>

      {/* Mini mastery change indicator */}
      {currentMasteryChange && (
        <div className="mb-4 flex items-center justify-center gap-3 text-sm animate-fade-in">
          <span className="text-[var(--color-text-muted)]">{currentMasteryChange.label}:</span>
          <span className="font-mono text-[var(--color-text-muted)]">{Math.round(currentMasteryChange.before * 100)}%</span>
          <span className={currentMasteryChange.isUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
            {currentMasteryChange.isUp ? '▲' : '▼'}
          </span>
          <span className={`font-mono font-bold ${currentMasteryChange.isUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            {Math.round(currentMasteryChange.after * 100)}%
          </span>
          <div className="w-24 h-2 rounded-full bg-[var(--color-surface-3)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${currentMasteryChange.after * 100}%`,
                backgroundColor: currentMasteryChange.isUp ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      <QuestionCard
        question={currentItem.question}
        concept={currentItem.concept}
        courseCode={deck.courseCode}
        onAnswer={handleAnswer}
      />

      {/* Session stats bar */}
      <div className="mt-6 flex justify-center gap-6 text-sm text-[var(--color-text-muted)]">
        <span>✓ {sessionStats.correct}</span>
        <span>✗ {sessionStats.wrong}</span>
        {sessionStats.streak > 0 && (
          <span className="text-[var(--color-warning)] animate-pop font-semibold">🔥 {sessionStats.streak}</span>
        )}
      </div>
    </div>
  );
}
