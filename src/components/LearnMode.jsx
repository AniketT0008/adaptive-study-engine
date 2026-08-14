import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, saveDeck, getApiKey } from '../engine/storage.js';
import { playSound } from '../utils/audio.js';
import { callGeminiText } from '../api/gemini.js';
import { stripMarkdown, toParagraphs, isCasualMessage, dedupeLines } from '../utils/formatText.js';
import ConceptDiagram from './ConceptDiagram.jsx';
import { getQuestionSet } from '../engine/teaching.js';

export default function LearnMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedConcepts, setReviewedConcepts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('lesson');

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const [selfCheckAnswered, setSelfCheckAnswered] = useState(false);
  const [selfCheckSelected, setSelfCheckSelected] = useState(null);
  const [isSelfCheckCorrect, setIsSelfCheckCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadedDeck = getDeck(id);
    if (loadedDeck) setDeck(loadedDeck);
  }, [id]);

  const concepts = deck?.concepts || [];
  const currentConcept = concepts[currentIndex];

  useEffect(() => {
    setActiveTab('lesson');
    setAiAnswer(null);
    setAiQuestion('');
    setSelfCheckAnswered(false);
    setSelfCheckSelected(null);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [currentIndex, currentConcept?.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < concepts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      playSound('click');
    }
  }, [concepts.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      playSound('click');
    }
  }, [currentIndex]);

  const toggleReviewed = useCallback(() => {
    if (!currentConcept || !deck) return;
    const newReviewed = new Set(reviewedConcepts);
    const now = new Date().toISOString();

    if (currentConcept.learnedAt || newReviewed.has(currentConcept.id)) {
      newReviewed.delete(currentConcept.id);
      const updatedDeck = {
        ...deck,
        concepts: deck.concepts.map((concept) => {
          if (concept.id !== currentConcept.id) return concept;
          const updatedConcept = { ...concept };
          delete updatedConcept.learnedAt;
          return updatedConcept;
        }),
      };
      saveDeck(updatedDeck);
      setDeck(updatedDeck);
    } else {
      newReviewed.add(currentConcept.id);
      playSound('correct');
      const updatedConcepts = deck.concepts.map(c =>
        c.id === currentConcept.id ? { ...c, learnedAt: now, nextReviewDate: now } : c
      );
      const updatedDeck = { ...deck, concepts: updatedConcepts };
      saveDeck(updatedDeck);
      setDeck(updatedDeck);
    }
    setReviewedConcepts(newReviewed);
  }, [currentConcept, deck, reviewedConcepts]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Enter') toggleReviewed();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, toggleReviewed]);

  if (!deck) {
    return <div className="text-center p-8 text-[var(--color-text-muted)]">Loading study material...</div>;
  }

  if (concepts.length === 0) {
    return <div className="text-center p-8 text-[var(--color-text-muted)]">No concepts found in this deck.</div>;
  }

  const isReviewed = Boolean(currentConcept?.learnedAt) || reviewedConcepts.has(currentConcept?.id);
  const unitLabel = currentConcept?.unit || deck.courseCode || deck.title;
  const topicList = currentConcept?.topics?.length
    ? currentConcept.topics
    : [currentConcept?.label].filter(Boolean);
  const currentUnit = deck.units?.find((unit) => unit.name === currentConcept?.unit);
  const unitDefinitionLines = toParagraphs(currentUnit?.definition || '');
  const topicDefinitionLines = toParagraphs(currentConcept?.topicDefinition || currentConcept?.sourceSnippet || '');
  const selfCheckQuestion = deck.questions?.find((question) => question.conceptId === currentConcept?.id && question.type === 'mcq');
  const selfCheckOptions = selfCheckQuestion?.options || [];

  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${currentConcept?.label}. ${currentConcept?.sourceSnippet}. Example: ${currentConcept?.example || ''}`;
      const utterance = new SpeechSynthesisUtterance(stripMarkdown(textToRead));
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const buildLocalTutorReply = (query) => {
    const qLower = query.toLowerCase();
    const example = stripMarkdown(currentConcept?.example || '');
    const explanation = currentConcept?.workedExplanation || `Start by stating the assumptions, then apply ${currentConcept?.label} and check the conclusion.`;
    const practiceSpec = getQuestionSet(currentConcept)[1];

    if (isCasualMessage(query)) {
      return `Hey! I'm here to help you with ${currentConcept?.label}.\n\nTry asking something like:\n• Walk me through the worked example\n• Show another practice problem\n• Why does this formula work?`;
    }

    if (qLower.includes('5') || qLower.includes('simple') || qLower.includes('kid')) {
      return `Simple take on ${currentConcept?.label}:\n\n${stripMarkdown(currentConcept?.sourceSnippet?.slice(0, 150) || '')}\n\nThink of it like building blocks — one piece connects to the next.`;
    }

    if (qLower.includes('walk') || qLower.includes('step') || qLower.includes('example')) {
      const requestedStep = query.match(/(?:step|through)\s*[:#-]?\s*(.+)$/i)?.[1]?.trim();
      return `Worked walkthrough for ${currentConcept?.label}:\n\n1. Identify the exact target. ${requestedStep ? `You asked about “${requestedStep},” so connect that phrase to the quantities, structures, or reaction shown in the lesson.` : `State what must be calculated, predicted, named, or explained.`}\n\n2. List the givens and conditions. Do not calculate yet; include units, signs, states of matter, data types, or assumptions that determine whether the method applies.\n\n3. Apply the mechanism. ${stripMarkdown(explanation)}\n\n4. Work the concrete example. ${example || stripMarkdown(currentConcept?.sourceSnippet || '')}\n\n5. Verify and interpret. Check conservation, units, charge, limiting behaviour, a boundary test, or an alternative representation. Then state what the result means in the language of ${currentConcept?.label}.`;
    }

    if (qLower.includes('practice') || qLower.includes('another problem') || qLower.includes('try one')) {
      return `New practice problem — ${currentConcept?.label}:\n\n${practiceSpec.prompt}\n\nTry it before opening the answer below.\n\nAnswer: ${practiceSpec.answer}\n\nSolution: ${practiceSpec.explanation}\n\nWhy the other approaches fail: they either use the wrong condition, reverse the governing relationship, or skip the check described in this lesson.`;
    }

    if (qLower.includes('why') || qLower.includes('formula') || qLower.includes('work')) {
      return `Why it works:\n\n${stripMarkdown(currentConcept?.intuition || currentConcept?.sourceSnippet || '')}\n\nThe formula or rule is valid only when its assumptions match the situation. In this lesson, the important check is: ${stripMarkdown(currentConcept?.commonMistake || 'verify the conditions before substituting values.')}`;
    }

    if (qLower.includes('engineering') || qLower.includes('real world') || qLower.includes('application')) {
      return `Real-world use:\n\n${stripMarkdown(currentConcept?.sourceSnippet || '')}\n\nExample:\n${stripMarkdown(currentConcept?.example || 'Apply this concept to a practical scenario with given inputs.')}`;
    }

    const keywords = qLower.split(/[^a-z0-9]+/).filter((word) => word.length >= 4 && !['what', 'when', 'where', 'which', 'does', 'this', 'that', 'about', 'explain'].includes(word));
    const evidence = [currentConcept?.sourceSnippet, currentConcept?.intuition, currentConcept?.workedExplanation, currentConcept?.example]
      .filter(Boolean)
      .flatMap((section) => stripMarkdown(section).split(/(?<=[.!?])\s+/))
      .filter((sentence) => keywords.length === 0 || keywords.some((word) => sentence.toLowerCase().includes(word)))
      .slice(0, 4);
    const directEvidence = evidence.length ? evidence.join(' ') : stripMarkdown(currentConcept?.shortDefinition || currentConcept?.sourceSnippet || '');
    return `Answer to “${query}”:\n\n${directEvidence}\n\nReasoning: ${stripMarkdown(explanation)}\n\nConcrete reference: ${example || 'Use the lesson diagram and check the stated assumptions before drawing a conclusion.'}`;
  };

  const buildFormulaExplanation = () => {
    const conceptName = currentConcept?.label || 'this lesson';
    const intuition = stripMarkdown(currentConcept?.intuition || currentConcept?.shortDefinition || currentConcept?.sourceSnippet || '');
    const method = stripMarkdown(currentConcept?.workedExplanation || 'Start from the governing definition, keep every assumption visible, and derive the result one step at a time.');
    const example = stripMarkdown(currentConcept?.example || 'Use a small concrete case and verify the result independently.');
    const warning = stripMarkdown(currentConcept?.commonMistake || 'Do not substitute values until the assumptions and variable meanings are clear.');

    return `Why the rule for ${conceptName} works:\n\n${intuition}\n\nDerivation or mechanism: ${method} Each symbol or step represents a defined quantity, operation, or causal link; the relationship works because those definitions are preserved from the givens to the conclusion. It is not a shortcut that applies automatically outside its stated conditions.\n\nConcrete check: ${example} Reproduce the setup, change one input, and verify that the result changes in the direction predicted by the definition. Common error: ${warning}`;
  };

  const handleAskAiTeacher = async (customPrompt) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim()) return;

    playSound('click');
    setIsAskingAi(true);
    setAiAnswer(null);
    setAiQuestion('');

    if (isCasualMessage(query)) {
      setAiAnswer(buildLocalTutorReply(query));
      setIsAskingAi(false);
      return;
    }

    const apiKey = getApiKey();

    if (apiKey.trim()) {
      const prompt = `You are a rigorous, responsive university tutor. Answer the student's exact question, not a generic lesson summary.

Concept: ${currentConcept?.label}
Unit: ${unitLabel}
Definition: ${currentConcept?.sourceSnippet}
Mechanism/intuition: ${currentConcept?.intuition || 'N/A'}
Worked example: ${currentConcept?.example || 'N/A'}
Common mistake: ${currentConcept?.commonMistake || 'N/A'}

Student question: ${query}

Rules:
- The Student question above is authoritative. Answer that exact question; never replace it with a prewritten FAQ response
- Use plain text only (no markdown, no asterisks, no bold)
- Use 180-260 words when an explanation is requested
- Lead with a direct answer that refers to the student's wording
- If the student quotes or refers to a particular step, explain that step itself before discussing the rest of the example
- For "walk me through" requests, show the actual algebra, reaction bookkeeping, code state, causal mechanism, or data reasoning—not a generic study checklist
- For "another practice problem", invent a fresh concrete problem with changed values or conditions, then include a separate fully worked answer
- For "why" requests, explain the mechanism or derivation, not only the result
- State assumptions and common errors where relevant
- Do not repeat the full course excerpt unless the student asks for it`;

      try {
        const response = await callGeminiText(prompt, apiKey);
        if (response) {
          setAiAnswer(dedupeLines(stripMarkdown(response)));
          setIsAskingAi(false);
          playSound('correct');
          return;
        }
      } catch (error) {
        console.warn('Tutor request failed; using the offline lesson explanation.', error);
      }
    }

    setAiAnswer(buildLocalTutorReply(query));
    setIsAskingAi(false);
    playSound('correct');
  };

  const handleSelfCheckSelect = (option) => {
    if (selfCheckAnswered) return;
    setSelfCheckSelected(option);
    setSelfCheckAnswered(true);
    const correct = option === selfCheckQuestion?.answer;
    setIsSelfCheckCorrect(correct);
    playSound(correct ? 'correct' : 'wrong');
  };

  const exampleSteps = (currentConcept?.example || '')
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lessonLines = toParagraphs(currentConcept?.sourceSnippet || '');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="text-[var(--color-text-muted)] hover:text-white flex items-center gap-2 transition-colors text-sm font-semibold"
        >
          ← Back to Deck
        </button>

        <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] text-xs font-semibold">
          <span className="bg-gradient-to-r from-[var(--color-accent)] to-[#a29bfe] text-white px-3.5 py-1 rounded-full shadow-md">
            Step 1: Learn
          </span>
          <span className="text-[var(--color-text-muted)]">→</span>
          <button
            onClick={() => navigate(`/deck/${id}`)}
            className="text-[var(--color-text-muted)] hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            Step 2: Quiz (from deck)
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--color-accent-light)] to-[#00cec9]">
            Teacher Mode
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">Textbook definitions, worked examples, lesson-specific visual models</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSpeech}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-[var(--color-accent)] text-white border-transparent animate-pulse'
                : 'bg-white/[0.04] text-[var(--color-text-muted)] hover:text-white border-white/[0.08]'
            }`}
          >
            <span>{isSpeaking ? '🔊' : '🗣️'}</span>
            <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
          </button>
          <span className="badge bg-white/[0.06] text-[var(--color-accent-light)] font-mono border border-white/[0.08] text-xs px-3 py-1">
            {currentIndex + 1} / {concepts.length}
          </span>
        </div>
      </div>

      <div className="glass-strong p-6 sm:p-8 rounded-2xl relative space-y-6 border border-white/[0.1] shadow-2xl">
        <div className="space-y-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.2)] px-3 py-1 rounded-full border border-[var(--color-accent)]/30">
              {unitLabel}
            </span>
            <button
              onClick={toggleReviewed}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all text-xs font-bold ${
                isReviewed
                  ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/40'
                  : 'bg-white/[0.05] text-[var(--color-text-muted)] border border-white/[0.08] hover:text-white'
              }`}
            >
              <span>{isReviewed ? '✓ Learned' : '☐ Mark as Learned'}</span>
            </button>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
            {currentConcept?.label}
          </h3>

          {topicList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topicList.map((topic, idx) => (
                <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] text-[var(--color-text-muted)] border border-white/[0.06]">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-success)]">Lesson objective</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">{currentConcept?.learningGoal || `Explain ${currentConcept?.label} and apply it to a new problem.`}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-warning)]">Watch for</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">{currentConcept?.commonMistake || `Applying ${currentConcept?.label} without checking the conditions first.`}</p>
          </div>
        </div>

        {(unitDefinitionLines.length > 0 || topicDefinitionLines.length > 0) && (
          <details className="group rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-bold text-white">
              <span>Unit and topic context</span>
              <span className="text-[var(--color-accent-light)] transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {unitDefinitionLines.length > 0 && (
                <section className="rounded-lg border border-[var(--color-accent)]/20 bg-[rgba(108,92,231,0.07)] p-4 space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-accent-light)]">Unit definition — {unitLabel}</h4>
                  {unitDefinitionLines.map((line, index) => <p key={index} className="text-xs leading-relaxed text-[var(--color-text-muted)]">{line}</p>)}
                </section>
              )}
              {topicDefinitionLines.length > 0 && (
                <section className="rounded-lg border border-[var(--color-success)]/20 bg-[rgba(0,206,201,0.06)] p-4 space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-success)]">Topic definition — {currentConcept?.label}</h4>
                  {topicDefinitionLines.map((line, index) => <p key={index} className="text-xs leading-relaxed text-[var(--color-text-muted)]">{line}</p>)}
                </section>
              )}
            </div>
          </details>
        )}

        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto pb-1">
          {[
            { id: 'lesson', icon: '📖', label: 'Definition' },
            { id: 'analogy', icon: '💡', label: 'Intuition' },
            { id: 'example', icon: '📝', label: 'Worked Examples' },
            { id: 'self-check', icon: '⚡', label: 'Quick Check' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); playSound('click'); }}
              className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--color-accent)] text-white bg-white/[0.06]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[160px] animate-fade-in">
          {activeTab === 'lesson' && (
            <div className="space-y-4">
              <ConceptDiagram courseCode={deck.courseCode} label={currentConcept?.label} snippet={currentConcept?.sourceSnippet} />

              <div className="bg-[var(--color-surface-2)] p-5 rounded-xl border border-white/[0.08] space-y-3">
                {lessonLines.map((line, idx) => (
                  <p key={idx} className={`text-[var(--color-text)] leading-relaxed ${idx === 0 ? 'text-lg font-medium text-white' : 'text-sm'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analogy' && (
            <div className="space-y-4 animate-fade-in">
              <ConceptDiagram courseCode={deck.courseCode} label={currentConcept?.label} snippet={currentConcept?.sourceSnippet} />
              <div className="bg-[rgba(0,206,201,0.08)] p-5 rounded-xl border border-[var(--color-success)]/30 space-y-3">
                <p className="text-base text-white leading-relaxed">{currentConcept?.intuition || currentConcept?.sourceSnippet}</p>
                <div className="p-4 bg-[#0f1117] rounded-lg border border-[var(--color-success)]/20 text-sm text-[var(--color-text-muted)]">
                  <span className="text-white font-semibold">How to reason with it:</span> {currentConcept?.workedExplanation || 'Start with the conditions, apply the relevant rule, then check the conclusion.'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-4 animate-fade-in">
              <ConceptDiagram courseCode={deck.courseCode} label={currentConcept?.label} snippet={currentConcept?.example || currentConcept?.sourceSnippet} />
              <div className="bg-[#0b0d13] p-5 rounded-xl border border-[var(--color-warning)]/30 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-warning)]">
                  Worked Examples
                </h4>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{currentConcept?.workedExplanation}</p>
                <div className="space-y-2">
                  {exampleSteps.length > 0 ? exampleSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-sm font-mono text-[var(--color-text)] bg-[var(--color-surface-2)] p-3 rounded-lg border border-white/[0.06]">
                      <span className="text-[var(--color-warning)] font-bold shrink-0">{idx + 1}.</span>
                      <span className="whitespace-pre-wrap">{stripMarkdown(step)}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-[var(--color-text-muted)]">No worked example yet — ask the AI tutor below for a practice problem.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'self-check' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[rgba(108,92,231,0.08)] p-5 rounded-xl border border-[var(--color-accent)]/30 space-y-4">
                <p className="text-sm font-medium text-white">
                  {selfCheckQuestion?.prompt || `What is the key idea behind ${currentConcept?.label}?`}
                </p>
                <div className="space-y-2">
                  {selfCheckOptions.map((opt, i) => {
                    let btnClass = 'w-full p-3 rounded-xl text-left text-xs font-semibold transition-all border ';
                    if (!selfCheckAnswered) {
                      btnClass += 'bg-white/[0.04] border-white/[0.08] hover:border-[var(--color-accent)] hover:bg-white/[0.08]';
                    } else if (opt === selfCheckQuestion?.answer) {
                      btnClass += 'bg-[rgba(0,206,201,0.2)] border-[var(--color-success)] text-[var(--color-success)]';
                    } else if (selfCheckSelected === opt) {
                      btnClass += 'bg-[rgba(255,118,117,0.2)] border-[var(--color-danger)] text-[var(--color-danger)]';
                    } else {
                      btnClass += 'bg-white/[0.02] border-transparent opacity-40';
                    }
                    return (
                      <button key={i} disabled={selfCheckAnswered} onClick={() => handleSelfCheckSelect(opt)} className={btnClass}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>
                {selfCheckOptions.length === 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">No formative check is available for this imported lesson yet.</p>
                )}
                {selfCheckAnswered && (
                  <div className={`p-3 rounded-lg text-xs font-medium ${isSelfCheckCorrect ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
                    {isSelfCheckCorrect ? 'Nice — you got it.' : 'Not quite — check the Definition and Worked Examples tabs.'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <span>💬</span> Ask about this topic
          </h4>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {[
              'Walk me through the example step-by-step',
              'Give me another practice problem',
              'Why does this formula work?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleAskAiTeacher(chip)}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1 rounded-full text-[var(--color-accent-light)] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAiTeacher()}
              placeholder={`Question about ${currentConcept?.label}...`}
              className="flex-1 text-xs"
            />
            <button
              onClick={() => handleAskAiTeacher()}
              disabled={isAskingAi || !aiQuestion.trim()}
              className="btn-primary text-xs px-4 py-2 font-bold disabled:opacity-40"
            >
              {isAskingAi ? 'Thinking...' : 'Ask'}
            </button>
          </div>

          {aiAnswer && (
            <div className="bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-accent)]/40 text-sm text-[var(--color-text)] animate-slide-up">
              <div className="flex items-start justify-between gap-2">
                <div className="whitespace-pre-wrap leading-relaxed space-y-2 font-sans flex-1">
                  {aiAnswer}
                </div>
                <button onClick={() => setAiAnswer(null)} className="text-[var(--color-text-muted)] hover:text-white shrink-0">✕</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-secondary disabled:opacity-30 flex items-center gap-2 text-sm font-bold px-5 py-2.5">
          ← Previous
        </button>
        <div className="text-xs text-[var(--color-text-muted)] font-semibold">
          {reviewedConcepts.size} / {concepts.length} learned
        </div>
        <button onClick={handleNext} disabled={currentIndex === concepts.length - 1} className="btn-secondary disabled:opacity-30 flex items-center gap-2 text-sm font-bold px-5 py-2.5">
          Next →
        </button>
      </div>
    </div>
  );
}
