import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXAMPLE_DECKS } from '../data/exampleDeck.js';
import { getUniversityDecksBySchool, buildDeckFromCatalogCourse } from '../data/universityCatalog.js';
import { createConcept, createDeck } from '../data/models.js';
import { saveDeck, loadDecks, getApiKey, saveApiKey, saveDecks, mergeDeckCollections } from '../engine/storage.js';
import { extractConcepts, generateQuestions, extractTextFromFile, testGeminiConnection } from '../api/gemini.js';
import { playSound } from '../utils/audio.js';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [decks, setDecks] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [selectedMaterialName, setSelectedMaterialName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loadingStep, setLoadingStep] = useState(null);
  const [error, setError] = useState('');
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [apiStatus, setApiStatus] = useState({ state: 'idle', message: 'Local fallback ready' });

  useEffect(() => {
    setDecks(loadDecks());
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setApiStatus({ state: 'idle', message: 'Saved key not verified' });
    }
  }, []);

  const handleLoadExample = (exampleDeck) => {
    playSound('click');
    const existing = loadDecks().find((deck) => deck.id === exampleDeck.id);
    if (!existing) {
      const deckCopy = JSON.parse(JSON.stringify(exampleDeck));
      const now = new Date().toISOString();
      deckCopy.createdAt = now;
      deckCopy.concepts.forEach((c) => {
        if (!c.nextReviewDate) c.nextReviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      });
      saveDeck(deckCopy);
    }
    navigate(`/deck/${exampleDeck.id}`);
  };

  const handleLoadUniversityCourse = (course) => {
    playSound('click');
    const deckId = course.id;
    const existing = loadDecks().find((deck) => deck.id === deckId);
    if (!existing) {
      const deckCopy = JSON.parse(JSON.stringify(buildDeckFromCatalogCourse(course)));
      const now = new Date().toISOString();
      deckCopy.createdAt = now;
      deckCopy.concepts.forEach((c) => {
        if (!c.nextReviewDate) c.nextReviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      });
      saveDeck(deckCopy);
    }
    navigate(`/deck/${deckId}`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setSelectedMaterialName(file.name);
    if (apiKey.trim()) saveApiKey(apiKey);
    
    setLoadingStep('extracting-file');
    try {
      const text = await extractTextFromFile(file, apiKey);
      if (text) {
        setMaterialInput(text);
        playSound('correct');
      } else {
        setSelectedMaterialName('');
        setError("Could not read file. Try pasting your notes directly into the box.");
      }
    } catch (err) {
      setSelectedMaterialName('');
      setError(err?.message || "File read error. Try pasting text directly.");
    } finally {
      setLoadingStep(null);
      e.target.value = '';
    }
  };

  const handleCreateDeck = async () => {
    playSound('click');
    if (!materialInput.trim()) {
      setError("Please paste some course material or upload a file.");
      return;
    }
    setError('');
    if (apiKey.trim()) saveApiKey(apiKey);

    try {
      setLoadingStep('extracting');
      const rawConcepts = await extractConcepts(materialInput, apiKey);
      
      const concepts = (rawConcepts || []).map((c, i) => createConcept({
        id: `c-gen-${Date.now()}-${i}`,
        label: c.label || `Concept ${i + 1}`,
        unit: c.unit || 'Imported Material',
        topics: c.topics || [c.label || `Concept ${i + 1}`],
        sourceSnippet: c.sourceSnippet || materialInput.slice(0, 150),
        example: c.example || `Practical Example: Applying ${c.label || 'this concept'} to solve problems.`,
        intuition: c.intuition,
        workedExplanation: c.workedExplanation,
        learningGoal: c.learningGoal,
        commonMistake: c.commonMistake,
      }));

      setLoadingStep('generating');
      const rawQuestions = await generateQuestions(concepts, apiKey);

      const deckId = `deck-${Date.now()}`;
      const titleSnippet = concepts[0]?.label ? `${concepts[0].label} & more` : 'Custom Generated Deck';
      const newDeck = createDeck({
        id: deckId,
        title: titleSnippet,
        concepts,
        questions: (rawQuestions || []).map((question) => ({
          ...question,
          type: 'mcq',
          options: Array.isArray(question.options) ? question.options.slice(0, 4) : [],
        }))
      });

      saveDeck(newDeck);
      setDecks(loadDecks());
      playSound('streak');
      navigate(`/deck/${deckId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to build deck. Please try again.");
    } finally {
      setLoadingStep(null);
    }
  };

  const handleVerifyApiKey = async () => {
    playSound('click');
    if (!apiKey.trim()) {
      setApiStatus({ state: 'error', message: 'Paste a Gemini API key first' });
      return;
    }

    setApiStatus({ state: 'checking', message: 'Checking Gemini...' });
    saveApiKey(apiKey);
    const result = await testGeminiConnection(apiKey);
    if (result.ok) {
      setApiStatus({ state: 'ok', message: `Connected (${result.model})` });
      playSound('correct');
    } else {
      setApiStatus({ state: 'error', message: result.error || 'Gemini connection failed' });
      playSound('wrong');
    }
  };

  const handleExportDecks = () => {
    playSound('click');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decks, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `synapse-decks-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportDecks = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const isDeck = (deck) => deck && typeof deck.id === 'string' && Array.isArray(deck.concepts) && Array.isArray(deck.questions);
        const importedDecks = Array.isArray(imported) ? imported : [imported];
        if (importedDecks.length > 0 && importedDecks.every(isDeck)) {
          const mergedDecks = mergeDeckCollections(loadDecks(), importedDecks);
          saveDecks(mergedDecks);
          setDecks(mergedDecks);
        } else {
          setError("Invalid deck file. Import a Synapse deck JSON export.");
          return;
        }
        playSound('streak');
      } catch { setError("Invalid JSON deck file."); }
      finally { e.target.value = ''; }
    };
    reader.onerror = () => {
      setError("Could not read that deck file.");
      e.target.value = '';
    };
  };

  const handleDeleteDeck = (e, deckId) => {
    e.stopPropagation();
    if (!confirm('Delete this deck? This cannot be undone.')) return;
    const updated = loadDecks().filter(d => d.id !== deckId);
    saveDecks(updated);
    setDecks(updated);
    playSound('click');
  };

  const totalSavedConcepts = decks.reduce((sum, deck) => sum + (deck.concepts?.length || 0), 0);
  const totalSavedReviews = decks.reduce((sum, deck) => sum + (deck.concepts || []).reduce((count, concept) => count + (concept.history?.length || 0), 0), 0);
  const dueSavedConcepts = decks.reduce((sum, deck) => {
    const now = new Date().toISOString();
    return sum + (deck.concepts || []).filter((concept) => concept.nextReviewDate <= now).length;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[var(--color-accent-light)] mb-2">
          🏆 CUTC Transform Hackathon
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-light)] via-[#00cec9] to-white tracking-tight">
          Synapse
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
          Learn smarter, not harder. AI-powered adaptive study engine with SM-2 spaced repetition.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ['Saved lessons', totalSavedConcepts],
          ['Due now', dueSavedConcepts],
          ['Reviews logged', totalSavedReviews],
        ].map(([label, value]) => (
          <div key={label} className="glass px-4 py-3 rounded-xl text-center border border-white/[0.08]">
            <div className="text-2xl font-extrabold text-[var(--color-text)]">{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-bold">{label}</div>
          </div>
        ))}
      </div>

      {/* Example Deck Picker */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <span>⚡</span> Quick Start — Pick a Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAMPLE_DECKS.map((deck) => {
            const saved = decks.find((d) => d.id === deck.id);
            const hasSavedProgress = saved && saved.concepts?.some(c => (c.history?.length || 0) > 0);
            const avgMastery = saved
              ? Math.round((saved.concepts.reduce((s, c) => s + (c.mastery || 0), 0) / saved.concepts.length) * 100)
              : 0;

            return (
              <button
                type="button"
                key={deck.id}
                onClick={() => handleLoadExample(deck)}
                className="glass-strong p-6 rounded-2xl cursor-pointer hover:border-[var(--color-accent)]/50 hover:scale-[1.02] transition-all border border-white/[0.08] relative overflow-hidden group flex flex-col justify-between text-left w-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity" />
                <div className="relative z-10 space-y-3">
                  <div className="text-3xl">{deck.emoji || '📚'}</div>
                  <h3 className="text-lg font-bold text-[var(--color-text)]">{deck.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{deck.description || `${deck.concepts.length} concepts`}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{deck.concepts.length} concepts</span>
                    <span>{deck.questions.length} questions</span>
                  </div>
                  {hasSavedProgress ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-success)] font-semibold">Continue studying</span>
                        <span className="font-bold" style={{ color: avgMastery >= 70 ? '#55efc4' : avgMastery >= 40 ? '#ffeaa7' : '#ff7675' }}>{avgMastery}%</span>
                      </div>
                      <div className="mastery-bar"><div className="mastery-bar-fill" style={{ width: `${avgMastery}%`, backgroundColor: avgMastery >= 70 ? '#55efc4' : avgMastery >= 40 ? '#ffeaa7' : '#ff7675' }} /></div>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-[var(--color-accent-light)]">Start learning →</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* University Course Library */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <span>🎓</span> University Course Library
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] -mt-2">
          Ready-made decks mapped to real courses at Waterloo, UofT, and Laurier — includes practice midterm mode.
        </p>
        {Object.entries(getUniversityDecksBySchool()).map(([school, courses]) => (
          <div key={school} className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-accent-light)]">{school}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((course) => {
                const saved = decks.find((d) => d.id === course.id);
                return (
                  <button
                    key={course.id}
                    onClick={() => handleLoadUniversityCourse(course)}
                    className="glass p-4 rounded-xl text-left border border-white/[0.08] hover:border-[var(--color-accent)]/50 hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-lg">{course.emoji}</span>
                      <span className="text-[10px] font-mono font-bold text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.15)] px-2 py-0.5 rounded-full">
                        {course.courseCode}
                      </span>
                    </div>
                    <h4 className="font-bold text-[var(--color-text)] text-sm">{course.title}</h4>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mt-1 line-clamp-2">{course.description}</p>
                    <div className="text-[11px] font-semibold text-[var(--color-accent-light)] mt-2">
                      {saved ? 'Continue →' : 'Load course deck →'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Deck */}
      <div className="space-y-4">
        {!showCreateDeck ? (
          <button
            onClick={() => { setShowCreateDeck(true); playSound('click'); }}
            className="w-full glass p-5 rounded-2xl text-left hover:border-[var(--color-accent)]/30 transition-all border border-white/[0.08] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-bold text-[var(--color-text)]">Create Custom Deck</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Paste notes, upload a PDF, or snap a photo of textbook pages</p>
              </div>
            </div>
            <span className="text-[var(--color-text-muted)] text-xl">+</span>
          </button>
        ) : (
          <div className="glass p-6 rounded-2xl border border-white/[0.08] space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
                <span>✨</span> Create Custom Study Deck
              </h3>
              <button onClick={() => setShowCreateDeck(false)} className="text-[var(--color-text-muted)] hover:text-white text-sm">✕ Close</button>
            </div>

            <textarea
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              placeholder="Paste your course notes, textbook chapter, or lecture summary here..."
              rows={5}
              className="w-full text-sm"
            />

            {/* File upload row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { if (pdfInputRef.current) pdfInputRef.current.value = ''; pdfInputRef.current?.click(); }}
                disabled={!!loadingStep}
                className="text-xs text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>📎</span> Choose Image, PDF, or Text File
              </button>
              <input ref={pdfInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md" onChange={handleFileUpload} className="hidden" />
              <span className="text-xs text-[var(--color-text-muted)]">Text and Markdown import locally. PDF and image extraction uses Gemini.</span>
            </div>

            {selectedMaterialName && (
              <div className="rounded-lg border border-[rgba(0,206,201,0.3)] bg-[rgba(0,206,201,0.08)] px-3 py-2 text-xs text-[var(--color-success)]">
                Selected file: <span className="font-semibold">{selectedMaterialName}</span>
              </div>
            )}

            {materialInput.trim() && (
              <div className="p-3 rounded-lg bg-[rgba(0,206,201,0.1)] border border-[rgba(0,206,201,0.3)] text-[var(--color-success)] text-xs flex items-center justify-between">
                <span>✅ Material ready for deck creation ({materialInput.length} characters)</span>
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Zero-API key fallback ready</span>
              </div>
            )}

            {/* API Key (Optional) */}
            <div className="space-y-2 pt-1">
              <label className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5 font-medium">
                🔑 Gemini API Key <span className="text-[var(--color-text-muted)]/60">(optional for text notes, required for images/PDFs)</span>
              </label>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                  apiStatus.state === 'ok'
                    ? 'text-[var(--color-success)] bg-[rgba(0,206,201,0.1)] border-[rgba(0,206,201,0.25)]'
                    : apiStatus.state === 'error'
                      ? 'text-[var(--color-danger)] bg-[rgba(255,118,117,0.1)] border-[rgba(255,118,117,0.25)]'
                      : 'text-[var(--color-text-muted)] bg-white/[0.04] border-white/[0.08]'
                }`}>
                  {apiStatus.message}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setApiStatus({ state: 'idle', message: e.target.value.trim() ? 'Not verified yet' : 'Local fallback ready' });
                  }}
                  placeholder="Paste Gemini API key..."
                  className="w-full text-xs"
                />
                <button
                  type="button"
                  onClick={handleVerifyApiKey}
                  disabled={apiStatus.state === 'checking'}
                  className="btn-secondary text-xs px-4 py-2 whitespace-nowrap disabled:opacity-50"
                >
                  {apiStatus.state === 'checking' ? 'Checking...' : 'Verify API'}
                </button>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Text and markdown files work offline. Gemini powers AI deck generation, tutor replies, and image/PDF text extraction.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,118,117,0.1)] border border-[rgba(255,118,117,0.3)] text-[var(--color-danger)] text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateDeck}
              disabled={!!loadingStep || !materialInput.trim()}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-xl shadow-[var(--color-accent)]/20"
            >
              {loadingStep === 'extracting-file' && <><span className="animate-spin">📄</span> Extracting text from image/file...</>}
              {loadingStep === 'extracting' && <><span className="animate-spin">⏳</span> Extracting Concepts...</>}
              {loadingStep === 'generating' && <><span className="animate-spin">⚡</span> Generating Questions...</>}
              {!loadingStep && '✨ Build Custom Study Deck'}
            </button>
          </div>
        )}
      </div>

      {/* Saved Decks */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            📚 Your Study Decks ({decks.length})
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handleExportDecks} disabled={decks.length === 0} className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors disabled:opacity-30">📥 Export</button>
            <button onClick={() => { if (fileInputRef.current) fileInputRef.current.value = ''; fileInputRef.current?.click(); }} className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors">📤 Import</button>
            <input type="file" ref={fileInputRef} onChange={handleImportDecks} accept=".json" className="hidden" />
          </div>
        </div>

        {decks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {decks.map((d) => {
              const avgMastery = d.concepts?.length
                ? Math.round((d.concepts.reduce((s, c) => s + (c.mastery || 0), 0) / d.concepts.length) * 100)
                : 0;
              return (
                <div
                  key={d.id}
                  onClick={() => { playSound('click'); navigate(`/deck/${d.id}`); }}
                  className="glass p-5 rounded-xl hover:border-[var(--color-accent)]/50 transition-all cursor-pointer space-y-3 hover:scale-[1.02] relative group"
                >
                  {!d.id.startsWith('example-') && (
                    <button
                      onClick={(e) => handleDeleteDeck(e, d.id)}
                      className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] opacity-0 group-hover:opacity-100 transition-all text-xs bg-white/[0.04] px-2 py-1 rounded"
                    >
                      🗑
                    </button>
                  )}
                  <h4 className="font-bold text-[var(--color-text)] truncate pr-8">{d.title}</h4>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{d.concepts?.length || 0} concepts</span>
                    <span>{avgMastery}% mastery</span>
                  </div>
                  <div className="mastery-bar">
                    <div className="mastery-bar-fill" style={{ width: `${avgMastery}%`, backgroundColor: avgMastery >= 70 ? '#55efc4' : avgMastery >= 40 ? '#ffeaa7' : '#ff7675' }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-8 text-center rounded-xl text-[var(--color-text-muted)] text-sm">
            No saved decks yet. Pick a topic above or create a custom deck!
          </div>
        )}
      </div>
    </div>
  );
}
