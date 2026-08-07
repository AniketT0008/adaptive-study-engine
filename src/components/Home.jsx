import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXAMPLE_DECKS } from '../data/exampleDeck.js';
import { createConcept, createDeck } from '../data/models.js';
import { saveDeck, loadDecks, getApiKey, saveApiKey, saveDecks, getDeck } from '../engine/storage.js';
import { extractConcepts, generateQuestions, extractTextFromFile } from '../api/gemini.js';
import { playSound } from '../utils/audio.js';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [decks, setDecks] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loadingStep, setLoadingStep] = useState(null);
  const [error, setError] = useState('');
  const [showCreateDeck, setShowCreateDeck] = useState(false);

  useEffect(() => {
    setDecks(loadDecks());
    const savedKey = getApiKey();
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleLoadExample = (exampleDeck) => {
    playSound('click');
    // Only save if deck doesn't exist in localStorage (preserves progress)
    const existing = getDeck(exampleDeck.id);
    if (!existing) {
      const deckCopy = JSON.parse(JSON.stringify(exampleDeck));
      const now = new Date().toISOString();
      deckCopy.createdAt = now;
      deckCopy.concepts.forEach(c => {
        c.nextReviewDate = now;
      });
      saveDeck(deckCopy);
    }
    navigate(`/deck/${exampleDeck.id}`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!apiKey.trim()) {
      setError("Gemini API key is required to extract text from files.");
      return;
    }
    setError('');
    saveApiKey(apiKey);
    setLoadingStep('extracting-file');
    try {
      const text = await extractTextFromFile(file, apiKey);
      if (!text) throw new Error("Could not extract text from file. Try a different file or paste text directly.");
      setMaterialInput(text);
      setLoadingStep(null);
      playSound('correct');
    } catch (err) {
      setError(err.message);
      setLoadingStep(null);
    }
  };

  const handleCreateDeck = async () => {
    playSound('click');
    if (!materialInput.trim()) {
      setError("Please paste some course material or upload a file.");
      return;
    }
    if (!apiKey.trim()) {
      setError("Gemini API key is required for AI generation.");
      return;
    }
    setError('');
    saveApiKey(apiKey);

    try {
      setLoadingStep('extracting');
      const rawConcepts = await extractConcepts(materialInput, apiKey);
      if (!rawConcepts || !Array.isArray(rawConcepts) || rawConcepts.length === 0) {
        throw new Error("Could not extract concepts. Check your API key or try different material.");
      }

      const concepts = rawConcepts.map((c, i) => createConcept({
        id: `c-gen-${Date.now()}-${i}`,
        label: c.label || `Concept ${i + 1}`,
        sourceSnippet: c.sourceSnippet || materialInput.slice(0, 150)
      }));

      setLoadingStep('generating');
      const rawQuestions = await generateQuestions(concepts, apiKey);
      if (!rawQuestions || !Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new Error("Failed to generate questions.");
      }

      const deckId = `deck-${Date.now()}`;
      const titleSnippet = concepts[0]?.label ? `${concepts[0].label} & more` : 'Generated Deck';
      const newDeck = createDeck({
        id: deckId,
        title: titleSnippet,
        concepts,
        questions: rawQuestions
      });

      saveDeck(newDeck);
      setDecks(loadDecks());
      playSound('streak');
      navigate(`/deck/${deckId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during AI generation.");
    } finally {
      setLoadingStep(null);
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
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.readAsText(e.target.files[0], "UTF-8");
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) { saveDecks(imported); setDecks(imported); }
        else if (imported.id && imported.concepts) { saveDeck(imported); setDecks(loadDecks()); }
        playSound('streak');
      } catch { setError("Invalid JSON deck file."); }
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

      {/* Example Deck Picker */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <span>⚡</span> Quick Start — Pick a Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAMPLE_DECKS.map((deck) => {
            const saved = getDeck(deck.id);
            const hasSavedProgress = saved && saved.concepts?.some(c => (c.history?.length || 0) > 0);
            const avgMastery = saved
              ? Math.round((saved.concepts.reduce((s, c) => s + (c.mastery || 0), 0) / saved.concepts.length) * 100)
              : 0;

            return (
              <div
                key={deck.id}
                onClick={() => handleLoadExample(deck)}
                className="glass-strong p-6 rounded-2xl cursor-pointer hover:border-[var(--color-accent)]/50 hover:scale-[1.02] transition-all border border-white/[0.08] relative overflow-hidden group"
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Custom Deck (collapsed by default) */}
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
                <p className="text-xs text-[var(--color-text-muted)]">Paste notes, upload a PDF, or snap a photo — AI generates your flashcards</p>
              </div>
            </div>
            <span className="text-[var(--color-text-muted)] text-xl">+</span>
          </button>
        ) : (
          <div className="glass p-6 rounded-2xl border border-white/[0.08] space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
                <span>✨</span> Create Custom Deck
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
                onClick={() => pdfInputRef.current?.click()}
                disabled={!!loadingStep}
                className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2 rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1.5"
              >
                📄 Upload PDF / Image
              </button>
              <input ref={pdfInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileUpload} className="hidden" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <button
                onClick={() => { setMaterialInput(`Cellular Respiration and ATP Production\n\nCellular respiration is the biochemical process by which cells extract energy from glucose and convert it into adenosine triphosphate (ATP). This pathway takes place in three main stages: glycolysis, the citric acid cycle (Krebs cycle), and oxidative phosphorylation.\n\nGlycolysis occurs in the cytoplasm and breaks down one glucose molecule into two pyruvate molecules, producing 2 ATP and 2 NADH.\n\nThe Citric Acid Cycle operates inside the mitochondria, yielding 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule.\n\nOxidative Phosphorylation generates approximately 26-28 ATP molecules through the electron transport chain.`); playSound('click'); }}
                className="text-xs text-[var(--color-accent-light)] hover:text-white transition-colors"
              >
                ✨ Fill sample notes
              </button>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                🔑 Gemini API Key <span className="text-[var(--color-text-muted)]/60">(free at ai.google.dev)</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key here..."
                className="w-full text-xs"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,118,117,0.1)] border border-[rgba(255,118,117,0.3)] text-[var(--color-danger)] text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateDeck}
              disabled={!!loadingStep}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingStep === 'extracting-file' && <><span className="animate-spin">📄</span> Extracting text from file...</>}
              {loadingStep === 'extracting' && <><span className="animate-spin">⏳</span> Extracting Concepts...</>}
              {loadingStep === 'generating' && <><span className="animate-spin">⚡</span> Generating Questions...</>}
              {!loadingStep && '✨ Generate Study Deck'}
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
            <button onClick={() => fileInputRef.current?.click()} className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors">📤 Import</button>
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
                  {/* Delete button for non-example decks */}
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
