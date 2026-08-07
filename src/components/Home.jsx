import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXAMPLE_DECK } from '../data/exampleDeck.js';
import { createConcept, createDeck } from '../data/models.js';
import { saveDeck, loadDecks, getApiKey, saveApiKey, saveDecks } from '../engine/storage.js';
import { extractConcepts, generateQuestions } from '../api/gemini.js';
import { playSound } from '../utils/audio.js';

const SAMPLE_MATERIAL = `Cellular Respiration and ATP Production

Cellular respiration is the biochemical process by which cells extract energy from glucose and convert it into adenosine triphosphate (ATP), the universal energy currency of living organisms. This vital metabolic pathway takes place in three main stages: glycolysis, the citric acid cycle (Krebs cycle), and oxidative phosphorylation via the electron transport chain.

Glycolysis occurs in the cytoplasm and breaks down one 6-carbon glucose molecule into two 3-carbon pyruvate molecules, producing a net gain of 2 ATP and 2 NADH. The process does not require oxygen (anaerobic). Following glycolysis, in the presence of oxygen, pyruvate enters the mitochondrial matrix where it is converted into Acetyl-CoA.

The Citric Acid Cycle operates inside the mitochondria. Acetyl-CoA combines with oxaloacetate to undergo a cycle of oxidation reactions. This stage yields 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule while releasing carbon dioxide as a byproduct. High-energy electron carriers (NADH and FADH2) transfer their electrons to the electron transport chain embedded in the inner mitochondrial membrane.

Oxidative Phosphorylation is the final and most productive stage. As electrons pass through a series of membrane proteins, protons (H+) are pumped into the intermembrane space, creating a proton gradient. Protons flow back into the matrix through ATP synthase, driving the phosphorylation of ADP to generate approximately 26 to 28 ATP molecules. In total, cellular respiration yields roughly 30 to 32 ATP per glucose molecule.`;

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [decks, setDecks] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loadingStep, setLoadingStep] = useState(null);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setDecks(loadDecks());
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKey(true);
    }
  }, []);

  const handleLoadExample = () => {
    playSound('click');
    const existingDecks = loadDecks();
    let example = existingDecks.find(d => d.id === EXAMPLE_DECK.id);
    
    const deckCopy = JSON.parse(JSON.stringify(EXAMPLE_DECK));
    const now = new Date().toISOString();
    deckCopy.concepts.forEach(c => {
      c.nextReviewDate = now;
    });
    saveDeck(deckCopy);

    navigate(`/deck/${EXAMPLE_DECK.id}`);
  };

  const handleFillSample = () => {
    playSound('click');
    setMaterialInput(SAMPLE_MATERIAL);
  };

  const handleCreateDeck = async () => {
    playSound('click');
    if (!materialInput.trim()) {
      setError("Please paste some course material to study.");
      return;
    }
    if (!apiKey.trim()) {
      setError("Gemini API key is required for AI generation.");
      setShowApiKey(true);
      return;
    }
    setError('');
    saveApiKey(apiKey);

    try {
      setLoadingStep('extracting');
      const rawConcepts = await extractConcepts(materialInput, apiKey);
      if (!rawConcepts || !Array.isArray(rawConcepts) || rawConcepts.length === 0) {
        throw new Error("Could not extract concepts. Check your API key or material content.");
      }

      const concepts = rawConcepts.map((c, i) => createConcept({
        id: `c-gen-${Date.now()}-${i}`,
        label: c.label || `Concept ${i + 1}`,
        sourceSnippet: c.sourceSnippet || materialInput.slice(0, 150)
      }));

      setLoadingStep('generating');
      const rawQuestions = await generateQuestions(concepts, apiKey);
      
      if (!rawQuestions || !Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new Error("Failed to generate questions for extracted concepts.");
      }

      const deckId = `deck-${Date.now()}`;
      const titleSnippet = concepts[0]?.label ? `${concepts[0].label} & more` : 'Generated Deck';
      const deckTitle = `Study Deck: ${titleSnippet}`;

      const newDeck = createDeck({
        id: deckId,
        title: deckTitle,
        concepts: concepts,
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

  // Export all decks to JSON file
  const handleExportDecks = () => {
    playSound('click');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `adaptive-decks-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import decks from JSON file
  const handleImportDecks = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            saveDecks(imported);
            setDecks(imported);
            playSound('streak');
          } else if (imported.id && imported.concepts) {
            saveDeck(imported);
            setDecks(loadDecks());
            playSound('streak');
          }
        } catch (err) {
          setError("Invalid JSON deck file.");
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[var(--color-accent-light)] mb-2">
          <span>🏆 CUTC Transform Hackathon Project</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-light)] via-[#00cec9] to-white tracking-tight">
          Adaptive Study Engine
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
          Learn smarter, not harder. Powered by SM-2 Spaced Repetition &amp; Gemini AI.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Example Deck (Primary Demo Path) */}
        <div className="glass-strong p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden border border-[var(--color-accent)]/30 glow-accent hover:border-[var(--color-accent)] transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent)] opacity-10 blur-3xl rounded-full" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(108,92,231,0.2)] text-[var(--color-accent-light)] text-xs font-semibold uppercase tracking-wider">
              ⚡ Instant Demo Path (No Network Needed)
            </div>
            <div className="text-4xl">🧪</div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Load Example Deck
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Instantly load a pre-generated <span className="text-white font-medium">Intro to Computer Science</span> deck with 12 concepts &amp; 36 questions. Zero setup, instant load, works 100% offline!
            </p>
          </div>

          <div className="mt-8 relative z-10">
            <button
              onClick={handleLoadExample}
              className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <span>🚀 Launch Example Deck</span>
            </button>
          </div>
        </div>

        {/* Right Card: Paste Material */}
        <div className="glass p-8 rounded-2xl flex flex-col justify-between border border-white/[0.08]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📝</span>
              <button
                onClick={handleFillSample}
                className="text-xs text-[var(--color-accent-light)] bg-[rgba(108,92,231,0.15)] hover:bg-[rgba(108,92,231,0.25)] px-3 py-1 rounded-full font-medium transition-colors"
              >
                ✨ Fill Sample Notes
              </button>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Create from Course Material
            </h2>
            
            <textarea
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              placeholder="Paste your course notes, textbook chapter, or lecture summary here..."
              rows={5}
              className="w-full text-sm"
            />

            {/* API Key Section */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-xs text-[var(--color-text-muted)] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>🔑</span>
                <span>{showApiKey ? 'Hide' : 'Configure'} Gemini API Key</span>
              </button>

              {showApiKey && (
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your Gemini API key here..."
                  className="w-full text-xs"
                />
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,118,117,0.1)] border border-[rgba(255,118,117,0.3)] text-[var(--color-danger)] text-xs">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleCreateDeck}
              disabled={!!loadingStep}
              className="btn-secondary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingStep === 'extracting' && (
                <>
                  <span className="animate-spin text-base">⏳</span>
                  <span>Extracting Concepts...</span>
                </>
              )}
              {loadingStep === 'generating' && (
                <>
                  <span className="animate-spin text-base">⚡</span>
                  <span>Generating Questions...</span>
                </>
              )}
              {!loadingStep && (
                <>
                  <span>✨ Extract &amp; Build Deck</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Saved Decks Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <span>📚</span> Saved Study Decks ({decks.length})
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDecks}
              disabled={decks.length === 0}
              className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors disabled:opacity-30"
            >
              📥 Export Decks
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[var(--color-text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.08] transition-colors"
            >
              📤 Import Deck
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportDecks}
              accept=".json"
              className="hidden"
            />
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
                  onClick={() => {
                    playSound('click');
                    navigate(`/deck/${d.id}`);
                  }}
                  className="glass p-5 rounded-xl hover:border-[var(--color-accent)]/50 transition-all cursor-pointer space-y-3 hover:scale-[1.02]"
                >
                  <h4 className="font-bold text-[var(--color-text)] truncate">{d.title}</h4>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{d.concepts?.length || 0} concepts</span>
                    <span>{avgMastery}% mastery</span>
                  </div>
                  <div className="mastery-bar">
                    <div
                      className="mastery-bar-fill"
                      style={{
                        width: `${avgMastery}%`,
                        backgroundColor: avgMastery >= 70 ? '#55efc4' : avgMastery >= 40 ? '#ffeaa7' : '#ff7675'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-8 text-center rounded-xl text-[var(--color-text-muted)] text-sm">
            No saved decks yet. Launch the example deck or paste course material above!
          </div>
        )}
      </div>
    </div>
  );
}
