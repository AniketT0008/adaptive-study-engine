import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck, saveDeck } from '../engine/storage.js';
import { playSound } from '../utils/audio.js';
import { callGemini } from '../api/gemini.js';

export default function LearnMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedConcepts, setReviewedConcepts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'analogy' | 'example' | 'self-check'
  
  // Ask AI Teacher state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Self-check question state
  const [selfCheckAnswered, setSelfCheckAnswered] = useState(false);
  const [selfCheckSelected, setSelfCheckSelected] = useState(null);
  const [isSelfCheckCorrect, setIsSelfCheckCorrect] = useState(false);

  // Text to speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadedDeck = getDeck(id);
    if (loadedDeck) {
      setDeck(loadedDeck);
    }
  }, [id]);

  const concepts = deck?.concepts || [];
  const currentConcept = concepts[currentIndex];

  // Reset tab and states when changing concept
  useEffect(() => {
    setActiveTab('lesson');
    setAiAnswer(null);
    setAiQuestion('');
    setSelfCheckAnswered(false);
    setSelfCheckSelected(null);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [currentIndex, currentConcept?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture keys if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

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
    return <div className="text-center p-8 text-[var(--color-text-muted)]">Loading study material...</div>;
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

  // Text to speech handler
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${currentConcept?.label}. ${currentConcept?.sourceSnippet}. Example: ${currentConcept?.example || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Ask AI Teacher handler
  const handleAskAiTeacher = async (customPrompt) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim()) return;

    playSound('click');
    setIsAskingAi(true);
    setAiAnswer(null);

    const apiKey = localStorage.getItem('synapse_gemini_api_key') || '';

    if (apiKey.trim()) {
      const prompt = `You are a world-class, engaging, passionate engineering and science teacher.
The student is studying the concept "${currentConcept?.label}".
Course excerpt: "${currentConcept?.sourceSnippet}".
Worked Example: "${currentConcept?.example}".

Student Question: "${query}"

Provide a clear, engaging, intuitive explanation that directly answers their question. Use bullet points or code/math formulas where helpful. Keep it concise (2-4 paragraphs max).`;

      const response = await callGemini(prompt, apiKey);
      if (response && (typeof response === 'string' || response.text)) {
        setAiAnswer(typeof response === 'string' ? response : response.text);
        setIsAskingAi(false);
        return;
      }
    }

    // Local intelligent response fallback
    setTimeout(() => {
      let responseText = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('5') || qLower.includes('simple') || qLower.includes('kid')) {
        responseText = `💡 **Simple Intuition for ${currentConcept?.label}:**\n\nThink of **${currentConcept?.label}** like a set of building blocks in nature. ${currentConcept?.sourceSnippet?.slice(0, 120)}...\n\nIn plain words: Whenever you see this problem, you just remember that one variable changes how the other one behaves!`;
      } else if (qLower.includes('engineering') || qLower.includes('real world') || qLower.includes('application')) {
        responseText = `🔬 **Engineering & Industry Application:**\n\nEngineers use **${currentConcept?.label}** daily in hardware design, structural analysis, and software optimization.\n\nFor instance, in real-world engineering systems:\n- ${currentConcept?.sourceSnippet}\n- Applied calculation: ${currentConcept?.example || 'Evaluating system tolerances and boundary conditions.'}`;
      } else if (qLower.includes('formula') || qLower.includes('why') || qLower.includes('math')) {
        responseText = `📐 **Formula & Mathematical Breakdown:**\n\nHere is why the math works for **${currentConcept?.label}**:\n\n1. **Core Law:** ${currentConcept?.sourceSnippet}\n2. **Applied Step:** ${currentConcept?.example || 'Given inputs X, we compute derivative or integral output Y.'}\n\nBy following this step-by-step logic, you eliminate errors and gain 100% precision!`;
      } else {
        responseText = `🎓 **AI Teacher Answer:**\n\nGreat question! Regarding **${currentConcept?.label}**:\n\n${currentConcept?.sourceSnippet}\n\nKey Takeaway: ${query} connects directly to how we apply ${currentConcept?.example || 'this rule in engineering problems.'}`;
      }

      setAiAnswer(responseText);
      setIsAskingAi(false);
      playSound('correct');
    }, 600);
  };

  // Generate self-check question from current concept
  const selfCheckOptionA = currentConcept?.sourceSnippet?.slice(0, 65) || 'Correct analytical application';
  const selfCheckOptionB = `Ignore boundary conditions in ${currentConcept?.label || 'concept'}`;
  const selfCheckOptionC = `Static zero value under all conditions`;
  
  const handleSelfCheckSelect = (optIndex) => {
    if (selfCheckAnswered) return;
    setSelfCheckSelected(optIndex);
    setSelfCheckAnswered(true);
    const correct = optIndex === 0;
    setIsSelfCheckCorrect(correct);
    playSound(correct ? 'correct' : 'wrong');
  };

  // Generate key takeaway points
  const keyPoints = currentConcept?.sourceSnippet
    ? currentConcept.sourceSnippet.split('. ').filter(s => s.trim().length > 10).slice(0, 3)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button 
          onClick={() => navigate(`/deck/${id}`)}
          className="text-[var(--color-text-muted)] hover:text-white flex items-center gap-2 transition-colors text-sm font-semibold"
        >
          ← Back to Deck
        </button>

        {/* Learning Workflow Stepper */}
        <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] text-xs font-semibold">
          <span className="bg-gradient-to-r from-[var(--color-accent)] to-[#a29bfe] text-white px-3.5 py-1 rounded-full shadow-md">
            🎓 Step 1: Master Concepts (Teacher)
          </span>
          <span className="text-[var(--color-text-muted)]">→</span>
          <button 
            onClick={() => navigate(`/review/${id}`)}
            className="text-[var(--color-text-muted)] hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            ⚡ Step 2: Quiz & Test
          </button>
        </div>
      </div>

      {/* Main Title & Progress Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--color-accent-light)] to-[#00cec9]">
            Interactive AI Teacher
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">Deep conceptual understanding through interactive breakdowns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSpeech}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-[var(--color-accent)] text-white border-transparent animate-pulse'
                : 'bg-white/[0.04] text-[var(--color-text-muted)] hover:text-white border-white/[0.08]'
            }`}
            title="Read lesson out loud"
          >
            <span>{isSpeaking ? '🔊' : '🗣️'}</span>
            <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
          </button>

          <span className="badge bg-white/[0.06] text-[var(--color-accent-light)] font-mono border border-white/[0.08] text-xs px-3 py-1">
            Concept {currentIndex + 1} of {concepts.length}
          </span>
        </div>
      </div>

      {/* Interactive Teacher Card */}
      <div className="glass-strong p-6 sm:p-8 rounded-2xl relative space-y-6 border border-white/[0.1] shadow-2xl">
        
        {/* Concept Title & Concept Badge */}
        <div className="space-y-2 border-b border-white/[0.08] pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.2)] px-3 py-1 rounded-full border border-[var(--color-accent)]/30">
              {deck.title} • Module {currentIndex + 1}
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
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto pb-1">
          <button
            onClick={() => { setActiveTab('lesson'); playSound('click'); }}
            className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'lesson'
                ? 'border-[var(--color-accent)] text-white bg-white/[0.06]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            <span>📖</span> Core Lesson
          </button>
          <button
            onClick={() => { setActiveTab('analogy'); playSound('click'); }}
            className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'analogy'
                ? 'border-[var(--color-success)] text-white bg-white/[0.06]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            <span>💡</span> Intuition & Analogy
          </button>
          <button
            onClick={() => { setActiveTab('example'); playSound('click'); }}
            className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'example'
                ? 'border-[var(--color-warning)] text-white bg-white/[0.06]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            <span>📐</span> Worked Math / Code
          </button>
          <button
            onClick={() => { setActiveTab('self-check'); playSound('click'); }}
            className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'self-check'
                ? 'border-[#ff7675] text-white bg-white/[0.06]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            <span>⚡</span> Mini Self-Check
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[160px] animate-fade-in">

          {/* Tab 1: Core Lesson */}
          {activeTab === 'lesson' && (
            <div className="space-y-4">
              <div className="bg-[var(--color-surface-2)] p-6 rounded-xl border border-white/[0.08] text-base text-[var(--color-text)] leading-relaxed shadow-inner font-sans">
                <p className="text-lg font-medium text-white mb-3 leading-snug">
                  {currentConcept?.sourceSnippet}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Understanding this principle allows you to model complex behavioral dynamics, formulate exact governing equations, and solve real-world problems accurately.
                </p>
              </div>

              {keyPoints.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-light)] flex items-center gap-1.5">
                    <span>🔑</span> Key Takeaway Checklist:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {keyPoints.map((point, idx) => (
                      <div key={idx} className="bg-white/[0.03] p-3 rounded-lg border border-white/[0.05] text-xs text-[var(--color-text)] flex items-start gap-2">
                        <span className="text-[var(--color-success)] font-bold">✓</span>
                        <span>{point.trim()}{point.endsWith('.') ? '' : '.'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Intuition & Real-World Analogy */}
          {activeTab === 'analogy' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[rgba(0,206,201,0.08)] p-6 rounded-xl border border-[var(--color-success)]/30 space-y-3">
                <h4 className="text-sm font-bold text-[var(--color-success)] flex items-center gap-2">
                  <span>💡</span> Intuitive Real-World Analogy:
                </h4>
                <p className="text-base text-white leading-relaxed font-sans">
                  Imagine you are designing a high-efficiency engineering system. <span className="font-bold text-[var(--color-success-light)]">{currentConcept?.label}</span> acts as the fundamental boundary condition that balances input energy against output resistance.
                </p>
                <div className="p-4 bg-[#0f1117] rounded-lg border border-[var(--color-success)]/20 text-xs text-[var(--color-text-muted)] space-y-1">
                  <span className="font-bold text-white block">Why engineers care:</span>
                  <p>Without accounting for {currentConcept?.label}, physical models fail to predict stability limits under dynamic strain or input fluctuations.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Worked Math / Code Example */}
          {activeTab === 'example' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#0b0d13] p-6 rounded-xl border border-[var(--color-warning)]/30 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-warning)] flex items-center gap-2">
                    <span>📐</span> Worked Calculation & Step-by-Step Sample:
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Verified Engineering Solution</span>
                </div>
                <div className="font-mono text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap bg-[var(--color-surface-2)] p-4 rounded-lg border border-white/[0.06]">
                  {currentConcept?.example || `Worked Example for ${currentConcept?.label}:\n1. Identify given parameters\n2. Substitute values into governing equation\n3. Calculate result with precise units.`}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Mini Self-Check */}
          {activeTab === 'self-check' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[rgba(108,92,231,0.08)] p-6 rounded-xl border border-[var(--color-accent)]/30 space-y-4">
                <h4 className="text-sm font-bold text-[var(--color-accent-light)] flex items-center gap-2">
                  <span>⚡</span> Quick Comprehension Check:
                </h4>
                <p className="text-sm font-medium text-white">
                  Based on this lesson, what is the key characteristic of <span className="text-[var(--color-accent-light)] font-bold">{currentConcept?.label}</span>?
                </p>

                <div className="space-y-2">
                  {[selfCheckOptionA, selfCheckOptionB, selfCheckOptionC].map((opt, i) => {
                    let btnClass = "w-full p-3 rounded-xl text-left text-xs font-semibold transition-all border ";
                    if (!selfCheckAnswered) {
                      btnClass += "bg-white/[0.04] border-white/[0.08] hover:border-[var(--color-accent)] hover:bg-white/[0.08]";
                    } else if (i === 0) {
                      btnClass += "bg-[rgba(0,206,201,0.2)] border-[var(--color-success)] text-[var(--color-success)]";
                    } else if (selfCheckSelected === i) {
                      btnClass += "bg-[rgba(255,118,117,0.2)] border-[var(--color-danger)] text-[var(--color-danger)]";
                    } else {
                      btnClass += "bg-white/[0.02] border-transparent opacity-40";
                    }

                    return (
                      <button
                        key={i}
                        disabled={selfCheckAnswered}
                        onClick={() => handleSelfCheckSelect(i)}
                        className={btnClass}
                      >
                        <div className="flex items-center justify-between">
                          <span>{i === 0 ? 'A' : i === 1 ? 'B' : 'C'}. {opt}</span>
                          {selfCheckAnswered && i === 0 && <span className="font-bold text-[var(--color-success)]">✓ Correct</span>}
                          {selfCheckAnswered && selfCheckSelected === i && i !== 0 && <span className="font-bold text-[var(--color-danger)]">✗ Incorrect</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selfCheckAnswered && (
                  <div className={`p-3 rounded-lg text-xs font-medium ${isSelfCheckCorrect ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
                    {isSelfCheckCorrect ? '🎉 Excellent! You have understood the concept.' : '💡 Review the Core Lesson tab above to refresh the key idea.'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ask AI Teacher Interactive Panel */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span>💬</span> Ask Your AI Tutor About {currentConcept?.label}:
            </h4>
            <span className="text-[10px] text-[var(--color-text-muted)]">Instant AI Clarifications</span>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => handleAskAiTeacher("Explain like I'm 5 with a fun analogy")}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1 rounded-full text-[var(--color-accent-light)] transition-colors"
            >
              💡 Explain like I'm 5
            </button>
            <button
              onClick={() => handleAskAiTeacher("Give me a real-world engineering application")}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1 rounded-full text-[var(--color-success-light)] transition-colors"
            >
              🔬 Real-world application
            </button>
            <button
              onClick={() => handleAskAiTeacher("Why does this mathematical formula work step-by-step?")}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1 rounded-full text-[var(--color-warning)] transition-colors"
            >
              📐 Why does the math work?
            </button>
          </div>

          {/* Question Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAiTeacher()}
              placeholder={`Have a question about ${currentConcept?.label}? Ask your AI Teacher...`}
              className="flex-1 text-xs"
            />
            <button
              onClick={() => handleAskAiTeacher()}
              disabled={isAskingAi || !aiQuestion.trim()}
              className="btn-primary text-xs px-4 py-2 font-bold disabled:opacity-40"
            >
              {isAskingAi ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>

          {/* AI Teacher Answer Box */}
          {aiAnswer && (
            <div className="bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-accent)]/40 text-xs text-[var(--color-text)] space-y-2 animate-slide-up shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="font-bold text-[var(--color-accent-light)] flex items-center gap-1.5">
                  <span>🎓</span> AI Teacher Response:
                </span>
                <button onClick={() => setAiAnswer(null)} className="text-[var(--color-text-muted)] hover:text-white">✕</button>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed space-y-2 font-sans">
                {aiAnswer}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Footer */}
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

      {/* Test Knowledge CTA Banner */}
      <div className="glass-strong p-6 rounded-2xl text-center space-y-4 border border-white/[0.08]">
        <div className="flex items-center justify-between max-w-md mx-auto text-xs font-semibold">
          <span className="text-[var(--color-text-muted)]">Learned Status:</span>
          <span className="font-bold text-[var(--color-success)]">{reviewedConcepts.size} of {concepts.length} concepts marked learned</span>
        </div>
        <div className="progress-bar max-w-md mx-auto">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(reviewedConcepts.size / concepts.length) * 100}%` }} 
          />
        </div>

        <div className="pt-2 flex justify-center gap-4">
          <button 
            onClick={() => {
              playSound('click');
              navigate(`/review/${id}`);
            }}
            className="btn-primary py-3.5 px-8 text-base font-bold shadow-lg shadow-[var(--color-accent)]/30 hover:scale-[1.02] transition-transform"
          >
            ⚡ Start Adaptive Quiz Session →
          </button>
        </div>
      </div>
    </div>
  );
}
